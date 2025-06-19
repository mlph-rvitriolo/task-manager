import supabase from '../config/supabase.js';

export const taskService = {
    // Get all tasks with their tags
    async getAllTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                task_tags (
                    tags (
                        id,
                        name
                    )
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data.map(task => ({
            ...task,
            tags: task.task_tags.map(tt => tt.tags.name)
        }));
    },

    // Get a single task by ID with its tags
    async getTaskById(id) {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                task_tags (
                    tags (
                        id,
                        name
                    )
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        if (!data) return null;
        
        return {
            ...data,
            tags: data.task_tags.map(tt => tt.tags.name)
        };
    },

    // Create a new task with tags
    async createTask(task) {
        // Start a transaction
        const { data: newTask, error: taskError } = await supabase
            .from('tasks')
            .insert([{
                title: task.title,
                description: task.description,
                complete: false
            }])
            .select()
            .single();
        
        if (taskError) throw taskError;

        // If there are tags, create them and link to the task
        if (task.tags && task.tags.length > 0) {
            // First, ensure all tags exist
            const { data: existingTags, error: tagsError } = await supabase
                .from('tags')
                .select('id, name')
                .in('name', task.tags);
            
            if (tagsError) throw tagsError;

            // Create any new tags that don't exist
            const existingTagNames = existingTags.map(t => t.name);
            const newTags = task.tags.filter(tag => !existingTagNames.includes(tag));
            
            if (newTags.length > 0) {
                const { data: createdTags, error: createError } = await supabase
                    .from('tags')
                    .insert(newTags.map(name => ({ name })))
                    .select();
                
                if (createError) throw createError;
                existingTags.push(...createdTags);
            }

            // Create task-tag relationships
            const taskTags = existingTags.map(tag => ({
                task_id: newTask.id,
                tag_id: tag.id
            }));

            const { error: linkError } = await supabase
                .from('task_tags')
                .insert(taskTags);
            
            if (linkError) throw linkError;
        }

        return this.getTaskById(newTask.id);
    },

    // Update a task and its tags
    async updateTask(id, updates) {
        // Update task details
        const { data: updatedTask, error: taskError } = await supabase
            .from('tasks')
            .update({
                title: updates.title,
                description: updates.description,
                complete: updates.complete
            })
            .eq('id', id)
            .select()
            .single();
        
        if (taskError) throw taskError;
        if (!updatedTask) return null;

        // If tags are provided, update them
        if (updates.tags) {
            // First, remove all existing tag relationships
            const { error: deleteError } = await supabase
                .from('task_tags')
                .delete()
                .eq('task_id', id);
            
            if (deleteError) throw deleteError;

            // Then add new tags (reusing the create logic)
            if (updates.tags.length > 0) {
                const { data: existingTags, error: tagsError } = await supabase
                    .from('tags')
                    .select('id, name')
                    .in('name', updates.tags);
                
                if (tagsError) throw tagsError;

                // Create any new tags that don't exist
                const existingTagNames = existingTags.map(t => t.name);
                const newTags = updates.tags.filter(tag => !existingTagNames.includes(tag));
                
                if (newTags.length > 0) {
                    const { data: createdTags, error: createError } = await supabase
                        .from('tags')
                        .insert(newTags.map(name => ({ name })))
                        .select();
                    
                    if (createError) throw createError;
                    existingTags.push(...createdTags);
                }

                // Create new task-tag relationships
                const taskTags = existingTags.map(tag => ({
                    task_id: id,
                    tag_id: tag.id
                }));

                const { error: linkError } = await supabase
                    .from('task_tags')
                    .insert(taskTags);
                
                if (linkError) throw linkError;
            }
        }

        return this.getTaskById(id);
    },

    // Delete a task and its tag relationships
    async deleteTask(id) {
        // First delete the task-tag relationships
        const { error: tagError } = await supabase
            .from('task_tags')
            .delete()
            .eq('task_id', id);
        
        if (tagError) throw tagError;

        // Then delete the task
        const { error: taskError } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        
        if (taskError) throw taskError;
        return true;
    },

    // Toggle task completion status
    async toggleTaskComplete(id) {
        const task = await this.getTaskById(id);
        const { data, error } = await supabase
            .from('tasks')
            .update({ complete: !task.complete })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return this.getTaskById(id);
    }
}; 
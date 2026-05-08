// backend/src/modules/messages/messages.controller.js
import { supabase } from '../../config/supabaseClient.js';

// 1. Get the Inbox Summary (Calls our new RPC)
export const getInbox = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase.rpc('get_user_inbox', {
            p_user_id: userId
        });

        if (error) throw error;

        res.status(200).json({ inbox: data || [] });
    } catch (error) {
        console.error('Get Inbox Error:', error);
        res.status(500).json({ error: 'Failed to fetch inbox.' });
    }
};

// 2. Get Chat History (Between two specific users for a specific product)
export const getChatHistory = async (req, res) => {
    try {
        const { userId, contactId, productId } = req.query;

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('product_id', productId)
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true }); // Oldest first for chat UI

        if (error) throw error;

        res.status(200).json({ messages: data || [] });
    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
};

// 3. Send a Message
export const sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, product_id, content } = req.body;

        // Fetch university_id to strictly enforce campus isolation
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('university_id')
            .eq('id', sender_id)
            .single();

        if (userError || !user) throw new Error('User not found.');

        const { data: message, error } = await supabase
            .from('messages')
            .insert([{
                sender_id,
                receiver_id,
                product_id,
                university_id: user.university_id,
                content,
                is_read: false
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
};

// 4. Mark Messages as Read
export const markAsRead = async (req, res) => {
    try {
        const { userId, contactId, productId } = req.body;

        // Set all unread messages sent BY the contact TO the logged-in user as read
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('receiver_id', userId)
            .eq('sender_id', contactId)
            .eq('product_id', productId)
            .eq('is_read', false);

        if (error) throw error;

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark as Read Error:', error);
        res.status(500).json({ error: 'Failed to update read status.' });
    }
};
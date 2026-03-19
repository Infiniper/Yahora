import { supabase } from '../../config/supabaseClient.js';

// 1. Request OTP
export const requestOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Extract the domain (e.g., from 'student@iiitk.ac.in' -> 'iiitk.ac.in')
        const domain = email.split('@')[1];
        if (!domain) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the domain exists in our universities table
        const { data: university, error: uniError } = await supabase
            .from('universities')
            .select('id, name')
            .eq('domain', domain)
            .single();

        if (uniError || !university) {
            return res.status(403).json({ 
                error: 'Unauthorized Domain. Yahora is not yet available at your university.' 
            });
        }

        // If domain is valid, tell Supabase to send the OTP
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true, // Creates the user in auth.users if they are new
            }
        });

        if (error) throw error;

        res.status(200).json({ 
            message: 'OTP sent successfully!', 
            university: university.name 
        });

    } catch (error) {
        console.error('OTP Request Error:', error);
        res.status(500).json({ error: 'Internal server error while sending OTP.' });
    }
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Ask Supabase to verify the token
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
        });

        if (error) throw error;

        // At this point, the user is successfully logged in.
        // We will add the Profile Creation/Onboarding logic here in the next step!

        res.status(200).json({
            message: 'Authentication successful',
            session: data.session, // Send the JWT token to the frontend
            user: data.user
        });

    } catch (error) {
        console.error('OTP Verify Error:', error);
        res.status(500).json({ error: 'Internal server error while verifying OTP.' });
    }
};
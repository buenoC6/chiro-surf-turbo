import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function ConfirmEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'waiting' | 'verifying' | 'done' | 'error'>('waiting');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const type = params.get('type');
        const mailParam = params.get('mail');

        if (mailParam) {
            setEmail(mailParam);
        }

        if (token && type === 'signup') {
            console.log('Email confirmé avec token:', token);
            setStatus('done');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [location, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const type = params.get('type');

        if (token && type === 'signup') {
            console.log('Email confirmé avec token:', token);
            setStatus('done');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [location, navigate]);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('verifying');
        setErrorMessage('');

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup', // peut aussi être 'magiclink' ou 'recovery' selon ton flux
        });

        if (error) {
            setStatus('error');
            setErrorMessage(error.message);
        } else {
            setStatus('done');
            setTimeout(() => navigate('/'), 1500);
        }
    };

    if (status === 'done') {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h1>✅ Adresse e-mail confirmée !</h1>
                <p>Redirection en cours...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
            <h1>Confirme ton adresse e-mail</h1>
            <p>Si tu n’as pas reçu de lien de confirmation, tu peux entrer le code OTP reçu par e-mail ci-dessous.</p>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type='email'
                    placeholder='Ton adresse e-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='text'
                    placeholder='Code OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type='submit' disabled={status === 'verifying'}>
                    {status === 'verifying' ? 'Vérification...' : 'Confirmer'}
                </button>
            </form>

            {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

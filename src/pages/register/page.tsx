import { FormEvent, useState } from 'react';
import Classes from './index.module.css';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function Register() {
    const { registerWithEmail, loginWithGoogle } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        try {
            await registerWithEmail(email, password);
            window.location.href = '/confirm-email?type=signup&mail=' + email;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={Classes.container}>
            <div className={Classes.card}>
                <h1 className={Classes.title}>Créer un compte</h1>

                <button onClick={loginWithGoogle} className={Classes.googleButton}>
                    <span>Continuer avec Google</span>
                </button>

                <div className={Classes.divider}>
                    <div className={Classes.line} />
                    <span>ou</span>
                    <div className={Classes.line} />
                </div>

                <form onSubmit={handleRegister} className={Classes.form}>
                    <div className={Classes.inputGroup}>
                        <Mail className={Classes.icon} size={18} />
                        <input name='email' type='email' placeholder='Adresse e-mail' required />
                    </div>

                    <div className={Classes.inputGroup}>
                        <Lock className={Classes.icon} size={18} />
                        <input name='password' type='password' placeholder='Mot de passe' required />
                    </div>

                    {error && <p className={Classes.error}>{error}</p>}

                    <button type='submit' className={Classes.submitButton}>
                        Créer un compte
                    </button>
                </form>

                <p className={Classes.registerHint}>
                    Déjà inscrit ? <a href='/login'>Connectez-vous</a>
                </p>
            </div>
        </div>
    );
}

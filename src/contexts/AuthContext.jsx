import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userEmail = session?.session?.user?.email;

      let userData = await supabase
        .from('users')
        .select('role, id')
        .eq('id', userId)
        .maybeSingle();

      if (!userData.data && userEmail) {
        const userByEmail = await supabase
          .from('users')
          .select('role, id')
          .eq('email', userEmail)
          .maybeSingle();

        if (userByEmail.data) {
          userData = userByEmail;
        } else {
          await supabase.from('users').insert({
            id: userId,
            email: userEmail,
            role: 'customer',
          });
          setUserRole('customer');
          setLoading(false);
          return;
        }
      }

      setUserRole(userData.data?.role || 'customer');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('customer');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        const mockUser = {
          id: existingUser.id,
          email: existingUser.email,
          user_metadata: {},
          app_metadata: {},
        };
        setUser(mockUser);
        setUserRole(existingUser.role);
        return { data: mockUser, error: null };
      } else {
        const newUserId = crypto.randomUUID();
        const { error: insertError } = await supabase.from('users').insert({
          id: newUserId,
          email: email,
          role: 'customer',
        });

        if (insertError) throw insertError;

        const mockUser = {
          id: newUserId,
          email: email,
          user_metadata: {},
          app_metadata: {},
        };
        setUser(mockUser);
        setUserRole('customer');
        return { data: mockUser, error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email) => {
    return signIn(email);
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    return { error: null };
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: userRole === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

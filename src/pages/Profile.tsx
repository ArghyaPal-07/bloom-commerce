import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
            <Link to="/login"><Button variant="accent">Sign In</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-8 shadow-soft">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.isAdmin ? 'Administrator' : 'Customer'}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/orders" className="flex-1"><Button variant="outline" className="w-full">View Orders</Button></Link>
              <Button variant="destructive" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

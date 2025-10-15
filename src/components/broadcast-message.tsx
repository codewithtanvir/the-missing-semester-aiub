'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BroadcastMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_at: string;
}

export function BroadcastMessage() {
  const [message, setMessage] = useState<BroadcastMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadMessage();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('broadcast_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broadcast_messages',
        },
        () => {
          loadMessage();
          setIsDismissed(false); // Show new/updated messages even if previous was dismissed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessage = async () => {
    const { data, error } = await supabase
      .from('broadcast_messages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setMessage(data);
      setIsVisible(true);
    } else {
      setMessage(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!message || isDismissed || !isVisible) {
    return null;
  }

  const getTypeStyles = () => {
    switch (message.type) {
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="h-5 w-5 text-blue-600" />,
          text: 'text-blue-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          text: 'text-yellow-800',
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: 'text-green-800',
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          text: 'text-red-800',
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: <Info className="h-5 w-5 text-gray-600" />,
          text: 'text-gray-800',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-top-2 duration-300">
      <div className={`${styles.bg} border-2 rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
          <div className={`flex-1 ${styles.text}`}>
            <p className="text-sm font-medium leading-relaxed">{message.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

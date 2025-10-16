'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface BroadcastMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_at: string;
}

export default function BroadcastPage() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'success' | 'error'>('info');
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('broadcast_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Message cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('broadcast_messages').insert({
        message: newMessage.trim(),
        type: messageType,
        is_active: true,
      } as any);

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create broadcast message',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Broadcast message created successfully',
        });
        setNewMessage('');
        setMessageType('info');
        loadMessages();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const updateData = { is_active: !currentState };
      const supabaseClient: any = supabase;
      const { error } = await supabaseClient
        .from('broadcast_messages')
        .update(updateData)
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update message',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Message ${!currentState ? 'activated' : 'deactivated'}`,
        });
        loadMessages();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broadcast message?')) {
      return;
    }

    const { error } = await supabase
      .from('broadcast_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
      loadMessages();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      error: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <main className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">Broadcast</h1>
        <p className="text-muted-foreground text-lg">Send announcements to all users instantly.</p>
      </header>

      {/* Create New Message */}
      <div className="rounded-2xl bg-card shadow-lg p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Create New Broadcast</h2>
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your broadcast message..."
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value as any)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="info">Info (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="error">Error (Red)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary text-white px-8 py-3 text-base font-semibold shadow hover:bg-primary/90 transition disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Broadcast'}
          </button>
        </form>
      </div>

      {/* Messages List */}
      <div className="rounded-2xl bg-card shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6">Active & Past Broadcasts</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No broadcast messages yet</p>
            <p className="text-sm text-muted-foreground">Create your first broadcast above!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`rounded-xl p-5 border transition ${getTypeColor(msg.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {msg.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        msg.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {msg.is_active ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg mb-2 break-words">{msg.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(msg.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(msg.id, msg.is_active)}
                      className="p-2 rounded-lg hover:bg-background/50 transition"
                      title={msg.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {msg.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
    
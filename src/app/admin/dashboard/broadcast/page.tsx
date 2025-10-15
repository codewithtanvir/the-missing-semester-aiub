'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Megaphone, Trash2, Plus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BroadcastMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function BroadcastManagementPage() {
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

  const handleCreate = async () => {
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
        console.error('Broadcast creation error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to create broadcast message. Please ensure you are logged in as admin.',
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
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabaseClient: any = supabase;
      const { error } = await supabaseClient
        .from('broadcast_messages')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) {
        console.error('Toggle error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update message',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Message ${!currentState ? 'activated' : 'deactivated'}`,
        });
        loadMessages();
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
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

  const getTypeBadge = (type: string) => {
    const styles = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[type as keyof typeof styles] || styles.info}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <Megaphone className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Broadcast Messages</h1>
          <p className="text-gray-600">Manage announcements shown to all users</p>
        </div>
      </div>

      {/* Create New Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Broadcast
          </CardTitle>
          <CardDescription>
            Create a floating message that will be displayed on the courses page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your broadcast message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Message Type</Label>
            <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info (Blue)</SelectItem>
                <SelectItem value="success">Success (Green)</SelectItem>
                <SelectItem value="warning">Warning (Yellow)</SelectItem>
                <SelectItem value="error">Error (Red)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate} disabled={submitting} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {submitting ? 'Creating...' : 'Create Broadcast'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Active & Past Broadcasts</CardTitle>
          <CardDescription>Manage existing broadcast messages</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No broadcast messages yet. Create one above!
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(msg.type)}
                        {msg.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(msg.id, msg.is_active)}
                      >
                        {msg.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useBooks } from '@/hooks/useBooks';
import { useToast } from '@/hooks/use-toast';

const addBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().optional(),
  pages: z.number().min(1).optional(),
  status: z.enum(['want-to-read', 'reading', 'finished']),
  currentPage: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  dateFinished: z.string().optional(),
});

type AddBookFormData = z.infer<typeof addBookSchema>;

interface AddBookModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isVisible, onClose }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const { addBook } = useBooks();
  const { toast } = useToast();

  const form = useForm<AddBookFormData>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      status: 'reading',
      currentPage: 0,
    },
  });

  const watchedStatus = form.watch('status');

  const onSubmit = async (data: AddBookFormData) => {
    try {
      const bookData = {
        ...data,
        pages: data.pages || undefined,
        currentPage: data.status === 'reading' ? data.currentPage : undefined,
        rating: data.status === 'finished' ? selectedRating || undefined : undefined,
        dateFinished: data.status === 'finished' && data.dateFinished ? new Date(data.dateFinished).toISOString() : undefined,
        dateStarted: data.status === 'reading' ? new Date().toISOString() : undefined,
      };

      await addBook.mutateAsync(bookData);
      toast({
        title: 'Success',
        description: 'Book added successfully!',
      });
      onClose();
      form.reset();
      setSelectedRating(0);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add book. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isVisible) return null;

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'History', 'Self-Help'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'want-to-read', label: 'Want to Read', icon: '📚' },
                      { value: 'reading', label: 'Reading', icon: '📖' },
                      { value: 'finished', label: 'Finished', icon: '✓' },
                    ].map((status) => (
                      <label
                        key={status.value}
                        className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          field.value === status.value
                            ? 'border-sage-500 bg-sage-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          value={status.value}
                          checked={field.value === status.value}
                          onChange={field.onChange}
                        />
                        <div className="text-center">
                          <div className="text-lg mb-1">{status.icon}</div>
                          <div className="text-xs">{status.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {watchedStatus === 'reading' && (
              <FormField
                control={form.control}
                name="currentPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Page</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {watchedStatus === 'finished' && (
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-2xl transition-colors ${
                          star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setSelectedRating(star)}
                      >
                        <Star className="w-6 h-6" fill={star <= selectedRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="dateFinished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Finished</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-sage-500 hover:bg-sage-600">
                Add Book
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

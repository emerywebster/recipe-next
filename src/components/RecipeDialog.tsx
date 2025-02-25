import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star, Loader2 } from 'lucide-react';
import { scrapeRecipe } from '@/lib/recipe-scraper';
import { toast } from './ui/use-toast';

interface RecipeFormData {
  title: string;
  url: string;
  imageUrl: string;
  description: string;
  rating: number;
  notes: string;
  tags: string[] | string;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'add' | 'edit';
  initialData?: Partial<RecipeFormData>;
  onSave?: (data: RecipeFormData) => void;
}

const RecipeDialog = ({
  open = true,
  onOpenChange = () => {},
  mode = 'add',
  initialData = {
    title: '',
    url: '',
    imageUrl: '',
    description: '',
    rating: 0,
    notes: '',
    tags: [],
    ingredients: [],
    instructions: [],
  },
  onSave = () => {},
}: RecipeDialogProps) => {
  const [step, setStep] = React.useState<'url' | 'details'>(mode === 'add' ? 'url' : 'details');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<RecipeFormData>(initialData as RecipeFormData);
  const [rating, setRating] = React.useState(initialData.rating);
  const urlInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (step === 'url' && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [step]);

  const handleUrlSubmit = async () => {
    if (!formData.url) {
      toast({
        title: 'Error',
        description: 'Please enter a recipe URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const scrapedData = await scrapeRecipe(formData.url);

      if (!scrapedData.title) {
        throw new Error('Could not extract recipe title');
      }

      setFormData((prev) => ({
        ...prev,
        ...scrapedData,
        description: scrapedData.description || `Recipe from ${scrapedData.source}`,
      }));

      // If we got ingredients and instructions, show a success message
      if (scrapedData.ingredients && scrapedData.instructions) {
        toast({
          title: 'Recipe extracted successfully',
          description: 'Please review the ingredients and instructions before saving.',
          variant: 'default',
        });
      } else {
        // If we only got basic info, show a warning
        toast({
          title: 'Recipe partially extracted',
          description: 'Could not extract ingredients and instructions. You may need to add them manually.',
          variant: 'destructive',
        });
      }

      setStep('details');
    } catch (error) {
      console.error('Error fetching recipe:', error);

      const isQuotaError =
        error instanceof Error && (error.message.includes('quota exceeded') || error.message.includes('API limits'));

      if (isQuotaError) {
        toast({
          title: 'Recipe Partially Saved',
          description:
            'The recipe was saved with basic information. Ingredients and instructions could not be extracted due to temporary service limitations.',
          variant: 'default',
        });
        setStep('details');
      } else {
        toast({
          title: 'Error fetching recipe',
          description:
            error instanceof Error
              ? error.message
              : 'Could not extract recipe information. Please check the URL and try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const tags =
      typeof formData.tags === 'string'
        ? formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : formData.tags || [];

    onSave({ ...formData, rating, tags });
  };

  if (step === 'url' && mode === 'add') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Recipe from URL</DialogTitle>
            <DialogDescription>Enter the URL of the recipe you'd like to save</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Recipe URL</Label>
              <Input
                ref={urlInputRef}
                id="url"
                placeholder="https://example.com/recipe"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-[800px] max-h-[90vh] overflow-y-auto">
        {formData.imageUrl && (
          <div className="relative w-full h-[300px] -mt-6 -mx-6 mb-6">
            <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover" />
          </div>
        )}

        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Confirm Recipe Details' : 'Edit Recipe'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Review and adjust the recipe details below' : 'Modify recipe details'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Recipe title"
              className="col-span-3"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Recipe description"
              className="col-span-3"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rating</Label>
            <div className="flex items-center col-span-3 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Personal notes, cooking tips, modifications..."
              className="col-span-3"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              className="col-span-3"
              value={typeof formData.tags === 'string' ? formData.tags : formData.tags.join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>

          {mode === 'add' && (
            <>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="ingredients" className="text-right pt-2">
                  Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  placeholder="Review the extracted ingredients"
                  className="col-span-3"
                  value={formData.ingredients?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ingredients: e.target.value.split('\n').filter(Boolean),
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="instructions" className="text-right pt-2">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Review the extracted instructions"
                  className="col-span-3"
                  value={formData.instructions?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value.split('\n').filter(Boolean),
                    }))
                  }
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {mode === 'add' && (
            <Button variant="outline" onClick={() => setStep('url')} className="mr-auto">
              Back to URL
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{mode === 'add' ? 'Add Recipe' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

type Item = {
  id: string;
  name: string;
  type: string;
  description: string;
  coverImage: string;
  images: string[];
  price: number;
  quantity: number;
  updatedAt: string;
};

// Validation schema
const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().url("Must be a valid URL"),
  images: z.string().min(1, "At least one image is required"),
  price: z.coerce.number().min(0, "Price is required"),
  quantity: z.coerce.number().min(0, "Quantity is required"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function ProductTable() {
  const [data, setData] = useState<Item[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Product type dropdown state
  const [productTypes, setProductTypes] = useState<string[]>([
    "Laptops",
    "Desktops", 
    "Monitors",
    "Keyboards",
    "Mouse",
    "Headphones",
    "Speakers",
    "Webcams",
    "Storage",
    "RAM",
    "Graphics Cards",
    "Processors",
    "Motherboards",
    "Power Supply",
    "Cooling",
    "Cases",
    "Cables",
    "Printers",
    "Tablets",
    "Smartphones"
  ]);
  const [addingNewType, setAddingNewType] = useState(false);
  const [newType, setNewType] = useState("");

  const defaultValues: ItemFormValues = {
    name: "",
    type: "",
    description: "",
    coverImage: "",
    images: "",
    price: 0,
    quantity: 0,
  };

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((products) => {
        const items: Item[] = (products || []).map((p: any) => ({
          id: p.id ?? Date.now().toString(),
          name: p.name ?? p.title ?? "Untitled",
          type: p.type ?? p.category ?? "General",
          description: p.description ?? "",
          coverImage: p.coverImage ?? p.image ?? "/placeholder.svg",
          images:
            p.images ??
            (p.image
              ? [p.image]
              : p.images?.split?.(",").map((s: string) => s.trim()) ?? []),
          price: Number(p.price ?? 0),
          quantity: Number(p.quantity ?? 0),
          updatedAt: p.updatedAt ?? new Date().toISOString(),
        }));
        setData(items);
        setIsLoading(false);

        // Extract unique product types from data
        const uniqueTypes = [
          ...new Set(items.map((item) => item.type).filter(Boolean)),
        ];
        setProductTypes((prev) => [...new Set([...prev, ...uniqueTypes])]);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [data, query]);

  useEffect(() => {
    if (open && !editId) {
      form.reset(defaultValues);
    }
    if (!open) {
      setEditId(null);
      setAddingNewType(false);
      setNewType("");
    }
  }, [open, editId]);

  const handleEditClick = (item: Item) => {
    setEditId(item.id);
    form.reset({
      name: item.name,
      type: item.type,
      description: item.description,
      coverImage: item.coverImage,
      images: (item.images || []).join(", "),
      price: item.price,
      quantity: item.quantity,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete");
      }

      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleAddNewType = () => {
    if (newType.trim() && !productTypes.includes(newType.trim())) {
      setProductTypes((prev) => [...prev, newType.trim()]);
      form.setValue("type", newType.trim());
      toast.success(`Added new type: ${newType.trim()}`);
    }
    setAddingNewType(false);
    setNewType("");
  };

  const onSubmit = async (values: ItemFormValues) => {
    const imagesArr = values.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editId) {
      // Edit existing item
      try {
        const res = await fetch(`/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, images: imagesArr }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Failed to update item");
        }

        const updatedItem = await res.json();
        setData((prev) =>
          prev.map((it) => (it.id === editId ? updatedItem : it))
        );
        toast.success("Item updated successfully!");
      } catch (err: any) {
        console.error(err);
        toast.error(`Update failed: ${err.message}`);
      }
    } else {
      // Add new item
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, images: imagesArr }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Failed to add item");
        }

        const newItem = await res.json();
        setData((prev) => [newItem, ...prev]);
        toast.success("Item added successfully!");
      } catch (err: any) {
        console.error(err);
        toast.error(`Add failed: ${err.message}`);
      }
    }

    form.reset(defaultValues);
    setOpen(false);
    setEditId(null);
  };

  if (error)
    return <p className="text-sm text-destructive">Failed to load items.</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, type, or description"
          />
          <Button variant="secondary" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type with dropdown */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Type</FormLabel>
                      {!addingNewType ? (
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              if (val === "add_new") {
                                setAddingNewType(true);
                              } else {
                                field.onChange(val);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {productTypes.map((type) => (
                                <div
                                  key={type}
                                  className="flex items-center justify-between px-2"
                                >
                                  <SelectItem value={type}>{type}</SelectItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-red-600 hover:bg-red-100 rounded-full"
                                      >
                                        ✕
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Type
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete{" "}
                                          <span className="font-semibold">
                                            {type}
                                          </span>{" "}
                                          from the list?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-600 text-white hover:bg-red-700"
                                          onClick={() => {
                                            setProductTypes((prev) =>
                                              prev.filter((t) => t !== type)
                                            );
                                            if (field.value === type) {
                                              field.onChange(""); // clear selection if deleted
                                            }
                                          }}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              ))}
                              <SelectItem value="add_new">
                                ➕ Add new type
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter new type"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleAddNewType}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAddingNewType(false);
                              setNewType("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Item description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover image */}
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Additional Images (comma separated URLs)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://img1.jpg, https://img2.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price + Quantity */}
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (INR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 1299"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editId ? "Update Item" : "Add Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>
          Inventory overview. Low-stock items (≤5) are highlighted.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={7}>Loading items...</TableCell>
            </TableRow>
          )}
          {!isLoading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No items found.</TableCell>
            </TableRow>
          )}
          {filtered.map((item) => {
            const lowStock = item.quantity <= 5;
            return (
              <TableRow
                key={item.id}
                className={lowStock ? "bg-muted/40" : undefined}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.coverImage || "/placeholder.svg"}
                      alt={item.name}
                      className="h-12 w-12 rounded-md border object-cover"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {item.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  ₹{item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Edit with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to edit{" "}
                          <span className="font-semibold">{item.name}</span>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handleEditClick(item)}
                        >
                          Yes, Edit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Delete with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete{" "}
                          <span className="font-semibold">{item.name}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

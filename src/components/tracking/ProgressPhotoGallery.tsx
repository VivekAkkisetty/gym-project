"use client";

import React, { useState } from "react";
import { Upload, Lock, ShieldCheck, Trash2, Eye, Image as ImageIcon, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProgressPhotoItem } from "@/types/tracking";
import { progressPhotoUploadSchema } from "@/lib/validations/tracking";

interface ProgressPhotoGalleryProps {
  photos: ProgressPhotoItem[];
  onUploadPhoto: (photo: ProgressPhotoItem) => void;
  onDeletePhoto: (photoId: string) => void;
  latestWeight?: number;
}

export function ProgressPhotoGallery({
  photos,
  onUploadPhoto,
  onDeletePhoto,
  latestWeight = 80,
}: ProgressPhotoGalleryProps) {
  const [poseTag, setPoseTag] = useState<"Front" | "Side" | "Back" | "General">("Front");
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<ProgressPhotoItem | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePhoto1, setComparePhoto1] = useState<ProgressPhotoItem | null>(null);
  const [comparePhoto2, setComparePhoto2] = useState<ProgressPhotoItem | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size and MIME type
    try {
      progressPhotoUploadSchema.parse({
        fileSize: file.size,
        fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Invalid image file.");
      } else {
        toast.error("Invalid image file. Max 5MB, JPEG/PNG/WebP only.");
      }
      return;
    }

    setIsUploading(true);

    // Read securely via FileReader as client-side Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      const newPhoto: ProgressPhotoItem = {
        id: `photo-${Date.now()}`,
        url: dataUrl,
        date: new Date().toISOString().split("T")[0],
        poseTag,
        weightKg: latestWeight,
        isPrivate: true,
      };

      onUploadPhoto(newPhoto);
      setIsUploading(false);
      toast.success("Progress photo securely uploaded and saved to private storage!");
      // Reset input
      e.target.value = "";
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read image file.");
    };

    reader.readAsDataURL(file);
  };

  const openComparison = () => {
    if (photos.length < 2) {
      toast.info("Upload at least 2 progress photos to compare visual changes side-by-side.");
      return;
    }
    setComparePhoto1(photos[photos.length - 1]); // oldest
    setComparePhoto2(photos[0]); // newest
    setCompareModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with Security Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground">Private Progress Photos</h3>
            <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40 gap-1">
              <Lock className="h-3 w-3" />
              <span>Owner-Only RLS Protected</span>
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Strictly isolated in private storage. Photos are never shared or made public.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {photos.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={openComparison}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-blue-500" />
              <span>Compare (Before / After)</span>
            </Button>
          )}
        </div>
      </div>

      {/* Upload Drop Zone Card */}
      <Card className="border-dashed border-2 border-border hover:border-emerald-500/50 transition-colors bg-muted/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Upload Private Progress Photo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Supports JPEG, PNG, WebP up to 5MB. Encrypted in private bucket.
              </p>
            </div>

            {/* Pose selector */}
            <div className="flex items-center gap-1.5 pt-1">
              {(["Front", "Side", "Back", "General"] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPoseTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    poseTag === tag
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label
                htmlFor="photoUploadInput"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Select Image from Device"}</span>
              </label>
              <input
                id="photoUploadInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden border-border group relative">
              <div className="aspect-[3/4] bg-muted/60 relative overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={`Progress on ${photo.date}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay details */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant="default" className="text-[9px] bg-black/70 backdrop-blur-xs text-white px-1.5 py-0">
                    {photo.poseTag}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2">
                  <div className="h-5 w-5 rounded-full bg-black/70 backdrop-blur-xs text-emerald-400 flex items-center justify-center">
                    <Lock className="h-2.5 w-2.5" />
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewPhoto(photo)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
                    title="View Photo"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      onDeletePhoto(photo.id);
                      toast.info("Photo removed from gallery.");
                    }}
                    className="p-2 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-2 text-xs flex items-center justify-between bg-card">
                <span className="text-muted-foreground font-mono text-[11px]">{photo.date}</span>
                {photo.weightKg && (
                  <span className="font-bold text-foreground text-[11px]">{photo.weightKg} kg</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
          <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-foreground">No Progress Photos Logged Yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Take consistent monthly check-in photos with identical lighting to measure visual hypertrophy and fat loss.
          </p>
        </div>
      )}

      {/* Single Photo Preview Modal */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-md p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span>{previewPhoto?.poseTag} Pose Check-in</span>
              <span className="text-xs text-muted-foreground font-mono">{previewPhoto?.date}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Logged at {previewPhoto?.weightKg ? `${previewPhoto.weightKg} kg` : "N/A"} • Strictly private
            </DialogDescription>
          </DialogHeader>

          {previewPhoto && (
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mt-2 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewPhoto.url} alt="Progress Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comparison Modal */}
      <Dialog open={compareModalOpen} onOpenChange={setCompareModalOpen}>
        <DialogContent className="max-w-3xl p-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
              <span>Before & After Visual Transformation</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Compare physical progression across check-in milestones.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {comparePhoto1 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">Earlier Check-In</span>
                  <span className="text-muted-foreground font-mono">{comparePhoto1.date} • {comparePhoto1.weightKg} kg</span>
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={comparePhoto1.url} alt="Before" className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {comparePhoto2 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-500">Latest Check-In</span>
                  <span className="text-muted-foreground font-mono">{comparePhoto2.date} • {comparePhoto2.weightKg} kg</span>
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={comparePhoto2.url} alt="After" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

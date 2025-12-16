"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/utils/supabase/provider"
import { Loader2, X, Upload, Star, Image } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

export function PropertyImages({ propertyId, initialImages = [], onUpdate, isSaving = false }) {
  const { toast } = useToast()
  const { supabase } = useSupabase()
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  // Debug logs
  useEffect(() => {
    console.log("PropertyImages - propertyId:", propertyId);
    console.log("PropertyImages - initialImages:", initialImages);
  }, [propertyId, initialImages]);

  // Initialize with initial images
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      console.log("Inicializando imágenes con:", initialImages);
      const formattedImages = initialImages.map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        url,
        file: null,
        preview: url,
        isUploaded: true,
        order: index
      }));
      setImages(formattedImages);
    } else {
      // Reset images when initialImages is empty
      setImages([]);
    }
  }, [initialImages]);

  // Setup dropzone for file uploads
  const onDrop = useCallback(acceptedFiles => {
    console.log("Archivos recibidos en dropzone:", acceptedFiles);
    const newImages = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      isUploaded: false,
      order: images.length + acceptedFiles.indexOf(file)
    }));
    
    setImages(prevImages => [...prevImages, ...newImages]);
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
  });

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (!image.isUploaded && image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  // Upload images to Supabase Storage
  const uploadImages = async () => {
    try {
      // Verificamos sólo que el propertyId no sea nulo o vacío
      if (!propertyId) {
        toast({
          title: "Error",
          description: "No se puede identificar la propiedad para subir imágenes.",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      
      const imagesToUpload = images.filter(img => !img.isUploaded && img.file);
      
      if (imagesToUpload.length === 0) {
        toast({
          title: "Advertencia",
          description: "No hay nuevas imágenes para subir",
          variant: "warning",
        });
        setUploading(false);
        return;
      }
      
      // Recoger las URLs existentes, asegurándonos que sean válidas
      const uploadedUrls = images
        .filter(img => img.isUploaded && img.url && typeof img.url === 'string')
        .map(img => img.url);
      
      const newUploadedUrls = [...uploadedUrls]; // Crear una copia para añadir las nuevas
      const uploadedImageMap = new Map(); // Para mapear IDs de imágenes a sus URLs subidas
      
      for (const image of imagesToUpload) {
        try {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${propertyId}/${uuidv4()}.${fileExt}`;
          
          // Create progress tracker for this file
          setUploadProgress(prev => ({ ...prev, [image.id]: 0 }));
          
          // Upload file with progress tracking
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, image.file, {
              cacheControl: '3600',
              upsert: false,
              onUploadProgress: (progress) => {
                const percent = (progress.loaded / progress.total) * 100;
                setUploadProgress(prev => ({ ...prev, [image.id]: percent }));
              }
            });
            
          if (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);
            
          // Validar la URL antes de añadirla
          if (publicUrl && typeof publicUrl === 'string') {
            console.log(`Imagen subida correctamente: ${publicUrl}`);
            newUploadedUrls.push(publicUrl);
            uploadedImageMap.set(image.id, publicUrl);
          } else {
            console.warn("URL pública inválida recibida de Supabase:", publicUrl);
          }
        } catch (uploadError) {
          console.error(`Error al subir imagen ${image.id}:`, uploadError);
          toast({
            title: "Error",
            description: `Error al subir una imagen: ${uploadError.message}`,
            variant: "destructive",
          });
          // Continuar con las demás imágenes
        }
      }
      
      // Update local state to mark all images as uploaded
      setImages(prevImages => 
        prevImages.map(img => {
          if (!img.isUploaded) {
            const newUrl = uploadedImageMap.get(img.id);
            if (newUrl) {
              return {
                ...img,
                isUploaded: true,
                url: newUrl,
                preview: newUrl
              };
            }
          }
          return img;
        })
      );
      
      // Clear progress
      setUploadProgress({});
      
      // Update the property with the new image URLs, asegurando que son válidas
      if (newUploadedUrls.length > 0) {
        await onUpdate(newUploadedUrls.filter(url => url && typeof url === 'string'));
        
        toast({
          title: "Imágenes subidas",
          description: `${imagesToUpload.length} imágenes subidas correctamente.`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Remove image from list
  const removeImage = (index) => {
    try {
      console.log("Eliminando imagen en índice:", index);
      const image = images[index];
      
      // If it's not an uploaded image, revoke the object URL
      if (!image.isUploaded && image.preview) {
        URL.revokeObjectURL(image.preview);
      }
      
      // Crear una copia del array sin la imagen eliminada
      const newImages = [...images];
      newImages.splice(index, 1);
      
      // Log para depuración
      console.log("Estado anterior:", images);
      console.log("Estado nuevo:", newImages);
      
      // Actualizar estado local
      setImages(newImages);
      
      // Extraer URLs válidas para actualizar el componente padre
      const validUrls = newImages
        .filter(img => img.url && typeof img.url === 'string')
        .map(img => img.url);
      
      console.log("URLs válidas después de eliminar:", validUrls);
      
      // IMPORTANTE: Llamar a onUpdate inmediatamente para garantizar que
      // el componente padre reciba los cambios
      onUpdate(validUrls);
      
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  // Set an image as the cover (first position)
  const setCoverImage = (index) => {
    try {
      if (index === 0) return; // Already the cover
      
      console.log("Estableciendo imagen principal:", index);
      
      // Crear una nueva copia del array y reordenar
      const newImages = [...images];
      const imageToMove = newImages.splice(index, 1)[0];
      newImages.unshift(imageToMove);
      
      // Actualizar órdenes
      const orderedImages = newImages.map((img, idx) => ({
        ...img,
        order: idx
      }));
      
      // Actualizar estado local
      setImages(orderedImages);
      
      // Log para depuración
      console.log("Estado anterior:", images);
      console.log("Estado nuevo ordenado:", orderedImages);
      
      // Extraer URLs válidas para actualizar el componente padre
      const validUrls = orderedImages
        .filter(img => img.url && typeof img.url === 'string')
        .map(img => img.url);
      
      console.log("URLs válidas después de reordenar:", validUrls);
      
      // IMPORTANTE: Llamar a onUpdate inmediatamente para garantizar que
      // el componente padre reciba los cambios
      onUpdate(validUrls);
      
      toast({
        title: "Imagen principal",
        description: "La imagen ha sido establecida como principal.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al establecer imagen principal:", error);
      toast({
        title: "Error",
        description: "No se pudo establecer la imagen como principal",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <span className="bg-brand-brown-500 w-1 h-5 mr-2 rounded-sm"></span>
            <Image className="h-5 w-5 mr-2 text-brand-brown-500" />
            Imágenes de la propiedad
          </h3>
          <p className="text-sm text-muted-foreground">
            La primera imagen será la principal en los listados
          </p>
        </div>
        
        {/* Drop zone */}
        <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-brand-brown-500 bg-brand-brown-500/10' 
                : 'border-border hover:border-brand-brown-500 bg-muted hover:bg-accent'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center py-4">
              <div className={`mb-4 rounded-full p-3 ${isDragActive ? 'bg-brand-brown-500/20' : 'bg-[#333333]'}`}>
                <Upload className="h-8 w-8 text-gray-300" />
              </div>
              
              {isDragActive ? (
                <p className="text-brand-brown-500 font-medium text-lg">Suelta las imágenes aquí...</p>
              ) : (
                <>
            <p className="mb-2 text-foreground font-medium">Arrastra imágenes aquí o haz clic para seleccionarlas</p>
            <p className="text-xs text-muted-foreground">
              Formatos aceptados: JPG, PNG, GIF, WEBP • Máximo 5MB por archivo
            </p>
                </>
              )}
            </div>
          </div>
          
          {/* Image previews */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h4 className="text-base font-medium text-foreground">Imágenes ({images.length})</h4>
              
              {images.some(img => !img.isUploaded) && (
                <Button
                  type="button"
                  onClick={uploadImages}
                  disabled={uploading || isSaving}
                  className="h-11 px-6 w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B59628] hover:from-[#B59628] hover:to-[#94791F] text-black font-semibold rounded-md shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      <span>Subir imágenes</span>
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div 
                  key={image.id || index} 
                  className="group relative aspect-video rounded-lg overflow-hidden border border-border transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={image.preview}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Show progress if uploading */}
                  {uploading && uploadProgress[image.id] !== undefined && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            className="stroke-[#333333]" 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            strokeWidth="10" 
                          />
                          <circle 
                            className="stroke-[#D4AF37]" 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            strokeWidth="10" 
                            strokeDasharray="283" 
                            strokeDashoffset={283 - (283 * uploadProgress[image.id]) / 100} 
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-foreground text-lg font-bold">
                          {Math.round(uploadProgress[image.id])}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Cover badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#D4AF37] to-[#B59628] px-3 py-1 rounded-full text-xs font-medium text-black shadow-md">
                      Principal
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        disabled={isSaving || uploading}
                        title="Eliminar imagen"
                        className="h-9 w-9 p-0 rounded-full shadow-md bg-red-600 hover:bg-red-700 border-none text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      {index !== 0 && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setCoverImage(index)}
                          disabled={isSaving || uploading}
                          title="Establecer como imagen principal"
                          className="h-9 w-9 p-0 rounded-full shadow-md bg-brand-brown-500 hover:bg-[#B59628] text-black border-none"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 

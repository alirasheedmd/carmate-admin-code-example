"use client";

import { useState, useRef } from "react";
import SlideUpModal from "../../ui/SlideUpModal";
import Button from "../../ui/button";
import CrossIcon from "@/assets/icons/CrossIcon";
import carImage from "@/assets/images/car-thumbnail3.png";
import carThumbnail from "@/assets/images/carSmallPlaceholder.png";
import { CarDetails, CreateListingsModalProps, FormData } from "@/types/vehicles";
import AddFileIcon from "@/assets/icons/AddFileIcon";
import PreviewSlider from "./PreviewSlider";
import ExitButton from "@/assets/icons/ExitButton";
import CreateListingForm from "./CreateListingForm";
import { useToast } from "@/components/ui/toast-context";
import SellersDescription from "@/components/ui/sellersDescrption";

export default function CreateListingsModal({
  isOpen,
  onClose,
  mode = 'create',
  listing,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  listing?: CarDetails;
}) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    price: listing?.price?.replace('$', '') || "",
    units: 1,
    hasMultipleCars: false,
  });
  const [carDetails, setCarDetails] = useState<CarDetails[]>([
    listing || {
      title: "2025 Toyota Land Cruiser",
      price: "$0",
      description: "1 unit available",
      images: [carImage.src],
      carThumbnails: [carThumbnail.src],
      sellerDescription: "Description will appear here.",
      isImageLoading: false,
      brand: "Toyota",
      manufacturingYear: "2025",
      model: "Land Cruiser",
    },
  ]);

  const handleFormDataChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setCarDetails(prev => prev.map(car => {
      const updatedCar = {
        ...car,
        [field]: value,
        title: `${field === 'manufacturingYear' ? value : car.manufacturingYear ?? ""} ${field === 'brand' ? value : car.brand ?? ""} ${field === 'model' ? value : car.model ?? ""}`,
        price: field === 'price' ? (value ? `$${value}` : '$0') : car.price,
        description: field === 'hasMultipleCars'
          ? `${value ? formData.units : 1} units available`
          : field === 'units'
            ? `${formData.hasMultipleCars ? value : 1} units available`
            : car.description
      };
      return updatedCar;
    }));
  };

  const handleCreateListing = async () => {
    try {
      const formSubmissionPromise = new Promise((resolve, reject) => {
        if (typeof window !== "undefined") {
          (window as any).onListingFormSubmit = (success: boolean, hasValidationErrors: boolean = false) => {
            if (success) {
              resolve(true);
            } else if (hasValidationErrors) {
              setIsLoading(false);
            } else {
              reject(new Error("Form submission failed"));
            }
          };
        }
      });

      if (typeof window !== "undefined" && (window as any).submitListingForm) {
        setIsLoading(true);
        (window as any).submitListingForm();
        await formSubmissionPromise;
        onClose();
      } else {
        throw new Error("Form submission function not found");
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create listing', 'error', 5000);
      setIsLoading(false);
    } finally {
      if (typeof window !== "undefined") {
        (window as any).onListingFormSubmit = undefined;
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCarDetails(prev => prev.map((car, index) => 
          index === 0 
            ? { ...car, images: [...car.images, imageSrc] , carThumbnails : [...car.images, imageSrc]  }
            : car
        ));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SlideUpModal
      isOpen={isOpen}
      onClose={onClose}
      showCrossBtn={false}
      width="md:!w-[92vw]"
    >
      <div className="flex flex-col h-full">
        <div className="flex py-4 px-8 items-center justify-between border-b border-border-dark">
          <h1 className="text-light-gray-1 font-bold text-[20px]">{mode === 'edit' ? 'Edit Listing' : 'Create New Listing'}</h1>
          <div className="cursor-pointer p-[5px]" onClick={onClose}>
            <CrossIcon />
          </div>
        </div>

        <div className="flex flex-1 overflow-auto md:overflow-hidden flex-wrap md:flex-nowrap">
          {/* Left Column */}
          <div className="py-6 px-4 md:w-96 border-r border-border-dark overflow-y-auto">
            <h5 className="text-light-gray-1 font-semibold text-xbase">
              Preview
            </h5>
            <PreviewSlider previewDetails={carDetails} />
            <SellersDescription description={carDetails.length > 0 ? carDetails[0].sellerDescription : ""} locationSubtitle={"Location"} />
          </div>

          {/* Right Column */}
          <div className="py-6 px-4 flex-1 overflow-y-auto">
            <div className="h-14 inline-flex flex-col justify-start items-start">
              <div className="h-6 justify-start text-light-gray-1 text-base font-semibold font-['Inter'] text-xbase">
                Photo upload
              </div>
              <div className="justify-start">
                <span className="text-text-gray text-xsm font-normal font-['Inter']">
                  Photos:{" "}
                </span>
                <span className="text-text-gray text-xsm font-semibold font-['Inter']">
                  {carDetails.length}/25
                </span>
                <span className="text-text-gray text-xsm font-normal font-['Inter']">
                  {" "}
                  · You can add up to 25 photos.
                </span>
              </div>
            </div>
            <div className="w-full overflow-auto">
              <div
                data-status="Photo Uploading"
                className="md:w-[768px] py-2 rounded-lg inline-flex justify-start items-center gap-2"
              >
                {carDetails.length > 0 && carDetails[0].carThumbnails?.map((image, index) => (
                  <div
                    key={image + index}
                    data-status="Loaded"
                    className="w-[104px] h-[104px] relative"
                  >
                    <div
                      role="button"
                      className="absolute top-2 right-1 cursor-pointer"
                      onClick={() => {
                        setCarDetails((prev) =>
                          prev.filter((_, i) => i !== index) && prev.map(car => ({
                            ...car,
                            images: car.images.filter((_, i) => i !== index),
                            carThumbnails : car.images.filter((_, i) => i !== index),
                          }))
                        );
                      }}
                    >
                      <ExitButton />
                    </div>
                    <img
                      className="w-[104px] h-[104px] rounded self-stretch object-fill aspect-auto"
                      src={image}
                      alt={carDetails[0].title}
                    />
                  </div>
                ))}
                {isUploading && (
                  <div data-status="Loading" className="relative">
                    <div className="w-[104px] h-[104px] bg-text-gray rounded" />
                    <div data-type="Image Container" className="w-6 h-6 left-[76px] top-[8px] absolute rounded-xl">
                      <ExitButton />
                    </div>
                    <div className="w-2 h-2 left-[36px] top-[48px] absolute bg-text-gray rounded-full animate-pulse" />
                    <div className="w-2 h-2 left-[47.89px] top-[48px] absolute bg-zinc-600 rounded-full animate-pulse" />
                    <div className="w-2 h-2 left-[59.77px] top-[48px] absolute bg-gray-500 rounded-full animate-pulse" />
                  </div>
                )}
                <div
                  className="w-[104px] h-[104px] bg-text-gray rounded inline-flex flex-col justify-center items-center gap-2 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AddFileIcon />
                  <div className="text-center justify-start text-border-dark text-xs font-medium font-['Inter']">
                    Add photo
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <CreateListingForm onFormDataChange={handleFormDataChange} />
          </div>
        </div>

        <div className="bg-panel-dark border-t border-charcoal-gray py-4 px-8">
          <div className="flex justify-end md:gap-6 gap-2">
            <Button
              variant="transparent"
              onClick={() => {
                console.log("Save as draft");
              }}
            >
              Save as draft
            </Button>
            <Button
              variant="secondary"
              rounded="full"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              rounded="full"
              onClick={handleCreateListing}
              loading={isLoading}
            >
              {mode === 'edit' ? 'Save Changes' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </SlideUpModal>
  );
}

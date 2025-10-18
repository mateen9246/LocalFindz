// types (adjust to your shapes if needed)
type DayKey =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

type DayHours = { isOpen: boolean; opening: string; closing: string };

type BusinessForm = {
  businessName: string;
  contactNumber: string;
  taxId: string;
  registrationNo: string;
  description: string;
  zipCode: string;
  tags: string[];
  images: Array<{ uri?: string } | string>;
  pdfDocument: { uri?: string; type?: string } | null;
  selectedCategory: string;
  businessHours: Record<DayKey, DayHours>;
};

type ValidationResult = {
  isValid: boolean;
  errors: Partial<
    Record<
      keyof BusinessForm | `${DayKey}.opening` | `${DayKey}.closing`,
      string
    >
  >;
  firstErrorKey?: string;
};

const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/;
const isValidTime = (t: string) => TIME_24H.test(t);

// simple helpers
const onlyDigits = (s: string) => s.replace(/\D/g, '');
const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function validateBusinessForm(data: BusinessForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // required simple fields
  if (!data.businessName?.trim())
    errors.businessName = 'Business name is required.';
  if (!data.taxId?.trim()) errors.taxId = 'Tax ID is required.';
  if (!data.registrationNo?.trim())
    errors.registrationNo = 'Registration number is required.';
  if (!data.description?.trim())
    errors.description = 'Description is required.';
  if (!data.selectedCategory?.trim())
    errors.selectedCategory = 'Category is required.';
  // phone (7–15 digits after stripping)
  const digitsPhone = onlyDigits(data.contactNumber || '');
  if (!digitsPhone || digitsPhone.length < 7 || digitsPhone.length > 15)
    errors.contactNumber = 'Enter a valid contact number (7–15 digits).';

  // zip (4–10 digits typical; adapt as needed)
  const digitsZip = onlyDigits(data.zipCode || '');
  if (!digitsZip || digitsZip.length < 4 || digitsZip.length > 10)
    errors.zipCode = 'Enter a valid ZIP/Postal code.';

  // tags, images, pdf
  if (!Array.isArray(data.tags) || data.tags.length === 0)
    errors.tags = 'Add at least one tag.';
  if (!Array.isArray(data.images) || data.images.length === 0)
    errors.images = 'Add at least one image.';
  if (!data.pdfDocument) errors.pdfDocument = 'Attach at least one menu (PDF).';
  else if (data.pdfDocument.type && !/pdf$/i.test(data.pdfDocument.type))
    errors.pdfDocument = 'Menu must be a PDF file.';

  // business hours: at least one open day with valid times, and each open day must have valid opening/closing (opening < closing)
  console.log(data.businessHours);
  const days = Object.keys(data.businessHours) as DayKey[];
  const openDays = days.filter(d => data.businessHours[d]?.isOpen);

  if (openDays.length === 0) {
    errors.businessHours = 'Add business hours for at least one day.';
  } else {
    for (const d of openDays) {
      const { opening, closing } = data.businessHours[d];

      if (!isValidTime(opening)) errors[`${d}.opening`] = 'Use HH:mm (24h).';
      if (!isValidTime(closing)) errors[`${d}.closing`] = 'Use HH:mm (24h).';

      if (isValidTime(opening) && isValidTime(closing)) {
        if (toMinutes(opening) >= toMinutes(closing)) {
          errors[`${d}.closing`] = 'Closing must be after opening.';
        }
      }
    }
  }

  const firstErrorKey = Object.keys(errors)[0] as
    | ValidationResult['firstErrorKey']
    | undefined;
  return { isValid: Object.keys(errors).length === 0, errors, firstErrorKey };
}

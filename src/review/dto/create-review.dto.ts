// Data Transfer Object for creating a new review
export class CreateReviewDto {
  rating: number;
  comment?: string;
  businessId: string;
}

declare module "react-rating" {
  import * as React from "react";

  interface RatingProps {
    readonly?: boolean;
    initialRating?: number;
    fractions?: number;
    onChange?: (rate: number) => void;
    emptySymbol?: React.ReactNode;
    fullSymbol?: React.ReactNode;
    placeholderSymbol?: React.ReactNode;
    placeholderRating?: number;
  }

  const Rating: React.FC<RatingProps>;
  export default Rating;
}

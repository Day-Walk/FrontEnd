export type PlaceType = {
  placeId: string;
  name: string;
  address: string;
  imgUrl: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type MessageType = {
  userId: string;
  question: string;
  answer: {
    placeList: PlaceType[];
    detail: string;
  };
  createAt: string;
};

export interface ChatMessageProps {
  message: ChatResponse;
  selectedMarker: { lat: number; lng: number } | null;
  setSelectedMarker: (value: { lat: number; lng: number }) => void;
  handleModalOpen: (placeList: any) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleClick: () => void;
}

export type ChatResponse = {
  placeList?: PlaceType[];
  detail?: string;
};

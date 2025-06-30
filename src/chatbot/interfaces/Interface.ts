export type PlaceType = {
  placeId: string;
  name: string;
  address: string;
  imgUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  messageId: string; // Optional, used for linking to messages
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

export type ChatResponse = {
  placeList?: PlaceType[];
  detail?: string;
};

export type CourseInfo = {
  title: string;
  visible: boolean;
  placeList: PlaceType[];
};

export type MarkerInfo = {
  location: {
    lat: number;
    lng: number;
  };
  placeId: string;
  messageId: string;
};
export interface ChatMessageProps {
  message: ChatResponse;
  selectedMarker: MarkerInfo | null;
  setSelectedMarker: (value: MarkerInfo) => void;
  handleModalOpen: (placeList: any) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleClick: () => void;
  loading: boolean;
  setInputValue: (value: string) => void;

  messageId: string;
}

export interface ChatRecordPopUpProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleClickClosePopup: () => void;
}
export interface AddCourseProps {
  courseInfo: PlaceType[];
  handleCloseCourseSaveModal: () => void;
}

export interface ChatInputProps {
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  sendChat: () => Promise<void>;
  loading: boolean;
}

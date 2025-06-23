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

export type ChatResponse = {
  placeList?: PlaceType[];
  detail?: string;
};

export type CourseInfo = {
  title: string;
  visible: boolean;
  placeList: PlaceType[];
};
export interface ChatMessageProps {
  message: ChatResponse;
  selectedMarker: { lat: number; lng: number } | null;
  setSelectedMarker: (value: { lat: number; lng: number }) => void;
  handleModalOpen: (placeList: any) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleClick: () => void;
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
  handlePressEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleClickSendBtn: () => void;
  loading: boolean;
}

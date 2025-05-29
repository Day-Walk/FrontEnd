import React from "react";
import styles from "../Signup.module.css";
import { data } from "../data";
import { Check } from "lucide-react";

interface Tag {
  tag: string;
  tagId: string;
}

interface SelectedTagList {
  categoryId: string;
  tagList: string[];
}

interface Category {
  categoryId: string;
  categoryName: string;
}

const SelectTag = ({ tag, tagId }: Tag) => {
  return (
    <div className={styles.tag_wrapper}>
      <input type="checkbox" className={styles.checkbox} id={tagId} />
      <label htmlFor={tagId}>{tag}</label>
      <Check
        color="#FFF"
        size={14}
        strokeWidth={3}
        style={{ position: "absolute", left: "3px", pointerEvents: "none" }}
      />
    </div>
  );
};

const UserLike = () => {
  // todo : 카테고리 전체 조회 api로 조회
  const categories = data.categoryList.map((category) => ({
    categoryId: category.categoryId,
    categoryName: category.categoryName,
  }));
  const tagList = data.categoryList.map((category) => category.tagList);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [selectedList, setSelectedList] = React.useState<SelectedTagList[]>([]);

  const handleClickCategory = (index: number) => {
    setSelected((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      } else {
        if (prev.length >= 3) {
          alert("최대 3개까지만 선택이 가능합니다.");
          return prev;
        } else return [...prev, index];
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup_wrapper}>
        <div className={styles.warning}>
          카테고리는 1개 ~ 3개, 태그는 1개 ~ 5개 선택해주세요!
        </div>
        <div className={styles.element_label}>
          어떤 장소를 찾아보러 오셨나요?
        </div>
        <div className={styles.category_wrapper}>
          {categories.map((category, index) => (
            <div
              key={category.categoryId}
              className={`${styles.element} ${styles.button} ${
                selected.includes(index) ? styles.selected_btn : ""
              }`}
              onClick={() => {
                handleClickCategory(index);
              }}
            >
              {category.categoryName}
            </div>
          ))}
        </div>
        <div className={styles.category_wrapper}>
          {tagList.map((tags, index) => (
            <div
              key={tags[0].tagId}
              style={{
                visibility: selected.includes(index) ? "visible" : "hidden",
              }}
            >
              {tags.map((tag) => (
                <SelectTag
                  key={tag.tagId}
                  tag={tag.keyword}
                  tagId={tag.tagId}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLike;

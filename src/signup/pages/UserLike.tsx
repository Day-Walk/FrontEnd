import React, { useState } from "react";
import styles from "../Signup.module.css";
import { data } from "../data";
import { Check } from "lucide-react";

interface Tag {
  tag: string;
  tagId: string;
  checked: boolean;
  handleChange: () => void;
}

interface SelectedTagList {
  categoryName: string;
  tagList: string[];
}

const SelectTag = ({ tag, tagId, checked, handleChange }: Tag) => {
  return (
    <div className={styles.tag_wrapper}>
      <input
        type="checkbox"
        className={styles.checkbox}
        id={tagId}
        checked={checked}
        onChange={handleChange}
      />
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
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedTagList, setSelectedTagList] = useState<SelectedTagList[]>([]);

  const handleClickCategory = (index: number) => {
    setSelected((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      } else {
        if (prev.length >= 3) {
          alert("카테고리는 최대 3개까지만 선택이 가능합니다.");
          return prev;
        } else return [...prev, index];
      }
    });
  };

  const handleClickTag = (categoryName: string, keyword: string) => {
    setSelectedTagList((prev) => {
      const existing = prev.find((item) => item.categoryName === categoryName);

      if (existing) {
        const updatedTagList = existing.tagList.includes(keyword)
          ? existing.tagList.filter((tag) => tag !== keyword)
          : existing.tagList.length < 5
            ? [...existing.tagList, keyword]
            : (alert("태그는 최대 5개까지만 선택할 수 있습니다."),
              existing.tagList);

        if (updatedTagList.length === 0) {
          return prev.filter((item) => item.categoryName !== categoryName);
        }

        return prev.map((item) =>
          item.categoryName === categoryName
            ? { ...item, tagList: updatedTagList }
            : item,
        );
      } else {
        return [...prev, { categoryName, tagList: [keyword] }];
      }
    });
  };

  const isFinished = () => {
    if (selected.length < 1 || selected.length > 3) return false;
    if (selectedTagList.length < 1 || selectedTagList.length > 3) return false;
    for (let item of selectedTagList) {
      if (item.tagList.length < 1 || item.tagList.length > 5) return false;
    }
    return true;
  };

  const handleClickCompleteBtn = async () => {
    console.log(selectedTagList);
    if (!isFinished()) {
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup_wrapper}>
        <div className={styles.warning}>
          카테고리는 1개 ~ 3개, 카테고리 당 태그는 1개 ~ 5개 선택해주세요!
        </div>
        <div className={styles.element_label}>
          어떤 장소를 찾아보러 오셨나요?
        </div>
        <div className={styles.category_wrapper}>
          {categories.map((category, index) => (
            <button
              key={category.categoryId}
              className={`${styles.element} ${styles.button} ${
                selected.includes(index) ? styles.selected_btn : ""
              }`}
              onClick={() => {
                handleClickCategory(index);
              }}
            >
              {category.categoryName}
            </button>
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
                  checked={
                    selectedTagList
                      .find(
                        (item) =>
                          item.categoryName === categories[index].categoryName,
                      )
                      ?.tagList.includes(tag.keyword) ?? false
                  }
                  handleChange={() => {
                    handleClickTag(categories[index].categoryName, tag.keyword);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.btn_wrapper}>
        <button
          className={`${styles.next_btn} ${isFinished() ? styles.active : ""}`}
          onClick={handleClickCompleteBtn}
        >
          완료 !
        </button>
      </div>
    </div>
  );
};

export default UserLike;

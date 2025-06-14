import React, { useEffect, useState } from "react";
import styles from "../Signup.module.css";
import { Check } from "lucide-react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

type TagInfoProps = {
  checked: boolean;
  handleChange: () => void;
};

type Tag = {
  tagId: string;
  keyword: string;
};

type Category = {
  categoryId: string;
  categoryName: string;
  tagList: Tag[];
};

interface SelectedTagList {
  categoryId: string;
  tagList: string[];
}

const SelectTag = ({
  keyword,
  tagId,
  checked,
  handleChange,
}: Tag & TagInfoProps) => {
  return (
    <div className={styles.tag_wrapper}>
      <input
        type="checkbox"
        className={styles.checkbox}
        id={tagId}
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={tagId}>{keyword}</label>
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
  const [data, setData] = useState<Category[]>([]);
  const categories = data.map((category) => ({
    categoryId: category.categoryId,
    categoryName: category.categoryName,
  }));
  const tagList = data.map((category) => category.tagList);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedTagList, setSelectedTagList] = useState<SelectedTagList[]>([]);

  const handleClickCategory = (index: number) => {
    setSelected((prev) => {
      if (prev.includes(index)) {
        setSelectedTagList((prev) =>
          prev.filter(
            (item) => item.categoryId !== categories[index].categoryId,
          ),
        );

        selectedTagList.filter(
          (item) => item.categoryId !== categories[index].categoryId,
        );
        return prev.filter((item) => item !== index);
      } else {
        if (prev.length >= 3) {
          alert("카테고리는 최대 3개까지만 선택이 가능합니다.");
          return prev;
        } else return [...prev, index];
      }
    });
  };

  const handleClickTag = (categoryId: string, tagId: string) => {
    setSelectedTagList((prev) => {
      const existing = prev.find((item) => item.categoryId === categoryId);

      if (existing) {
        const updatedTagList = existing.tagList.includes(tagId)
          ? existing.tagList.filter((tag) => tag !== tagId)
          : existing.tagList.length < 5
            ? [...existing.tagList, tagId]
            : (alert("태그는 최대 5개까지만 선택할 수 있습니다."),
              existing.tagList);

        if (updatedTagList.length === 0) {
          return prev.filter((item) => item.categoryId !== categoryId);
        }

        return prev.map((item) =>
          item.categoryId === categoryId
            ? { ...item, tagList: updatedTagList }
            : item,
        );
      } else {
        return [...prev, { categoryId, tagList: [tagId] }];
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

  const navigate = useNavigate();

  const handleClickCompleteBtn = async () => {
    console.log(selectedTagList);
    if (!isFinished()) {
      return;
    }

    try {
      const res = await api.post("/user-like", {
        userId: localStorage.getItem("userId"),
        categoryList: selectedTagList.map((item) => ({
          categoryId: item.categoryId,
          tagList: item.tagList,
        })),
      });
      navigate("/");
    } catch (error) {
      console.error("사용자 선호 카테고리 저장 오류:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await api.get("/category/all");
      const categoryData = res.data.categoryList;
      setData(categoryData);
    } catch (error) {
      console.error("카테고리 조회 오류:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
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
                  keyword={tag.keyword}
                  tagId={tag.tagId}
                  checked={
                    selectedTagList
                      .find(
                        (item) =>
                          item.categoryId === categories[index].categoryId,
                      )
                      ?.tagList.includes(tag.tagId) ?? false
                  }
                  handleChange={() => {
                    handleClickTag(categories[index].categoryId, tag.tagId);
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

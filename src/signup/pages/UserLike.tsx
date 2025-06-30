import React, { useEffect, useState } from "react";
import styles from "../Signup.module.css";
import { Check } from "lucide-react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../global_components/AlertModal/AlertModal";

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
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

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
        return [...prev, index];
      }
    });
  };

  const handleClickTag = (categoryId: string, tagId: string) => {
    let exceeded = false;

    setSelectedTagList((prev) => {
      const existing = prev.find((item) => item.categoryId === categoryId);

      if (existing) {
        let updatedTagList: string[];

        if (existing.tagList.includes(tagId)) {
          // 태그 해제
          updatedTagList = existing.tagList.filter((tag) => tag !== tagId);
        } else if (existing.tagList.length < 5) {
          // 새 태그 추가
          updatedTagList = [...existing.tagList, tagId];
        } else {
          // 태그 5개 초과 시
          exceeded = true;
          return prev; // 상태 변경 없음
        }

        // 태그 모두 제거 시 해당 카테고리 제거
        if (updatedTagList.length === 0) {
          return prev.filter((item) => item.categoryId !== categoryId);
        }

        return prev.map((item) =>
          item.categoryId === categoryId
            ? { ...item, tagList: updatedTagList }
            : item,
        );
      } else {
        if (selectedTagList.length >= 3) {
          setMessage("카테고리는 최대 3개까지만 선택할 수 있습니다.");
          setShowModal(true);
          return prev;
        } else {
          // 새로운 카테고리 추가
          return [...prev, { categoryId, tagList: [tagId] }];
        }
      }
    });

    // 모달 실행
    if (exceeded) {
      setShowModal(true);
      setMessage("카테고리 당 태그는 최대 5개까지만 선택할 수 있습니다.");
    }
  };

  const isFinished = () => {
    if (selectedTagList.length < 1 || selectedTagList.length > 3) return false;
    for (let item of selectedTagList) {
      if (item.tagList.length < 1 || item.tagList.length > 5) return false;
    }
    return true;
  };

  const navigate = useNavigate();

  const handleClickCompleteBtn = async () => {
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
          {categories.map((category, index) => {
            const isSelected = selected.includes(index);
            const isInTagList = selectedTagList.some(
              (tagList) => tagList.categoryId === category.categoryId,
            );
            return (
              <button
                key={category.categoryId}
                className={`${styles.element} ${styles.button} ${isSelected && isInTagList ? styles.selected_btn : ""} ${isSelected && !isInTagList ? styles.selected_category : ""}`}
                onClick={() => {
                  handleClickCategory(index);
                }}
              >
                {category.categoryName}
              </button>
            );
          })}
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
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default UserLike;

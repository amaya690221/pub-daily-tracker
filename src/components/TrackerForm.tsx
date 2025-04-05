// /src/components/TrackerForm.tsx

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { CategoriesData, Log } from "../types";
import { Schema, trackerSchema } from "../validations/schema";

type Props = {
  categories: CategoriesData;
  isFormOpen: boolean;
  onCloseForm: () => void;
  currentDay: string;
  saveLogsData: (data: Schema) => Promise<null | undefined>;
  dailyLogs: Log[];
  deleteLogsData: (ids: string | string[]) => Promise<null | undefined>;
  updateLogsData: (data: Schema, id: string) => Promise<null | undefined>;
  isMobile: boolean;
  isMobileFormOpen: boolean;
  setIsMobileFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TrackerForm = ({
  categories,
  isFormOpen,
  onCloseForm,
  currentDay,
  saveLogsData,
  dailyLogs,
  deleteLogsData,
  updateLogsData,
  isMobile,
  isMobileFormOpen,
  setIsMobileFormOpen,
}: Props) => {
  const theme = useTheme();
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      date: currentDay,
      category: [] as string[],
      memo: "",
    },
    resolver: zodResolver(trackerSchema),
  });
  const [categoryError, setCategoryError] = useState(false);

  const formWidth = 320;

  // 現在のカテゴリ配列を取得
  const selectedCategories = watch("category");

  // カテゴリー選択時の処理
  const handleChangeCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const categoryId = e.target.value;
    setValue(
      "category",
      checked
        ? [...selectedCategories, categoryId] // チェック時は追加
        : selectedCategories.filter((id) => id !== categoryId) // チェック解除時は削除
    );
    setCategoryError(checked ? false : categoryError);
  };

  //フォーム送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    //dailyLogs有無で、更新、保存処理を分ける
    if (dailyLogs.length !== 0) {
      //dailyLogsがある場合は、更新処理
      updateLogsData(data, dailyLogs[0].id)
        .then(() => {
          console.log("更新しました", data);
          if (isMobile) {
            setIsMobileFormOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      //dailyLogsがない場合は、保存処理
      saveLogsData(data)
        .then(() => {
          console.log("保存しました", data);
          if (isMobile) {
            setIsMobileFormOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //選択されたトラッカーデータを反映
  useEffect(() => {
    if (dailyLogs.length !== 0) {
      setValue("date", dailyLogs[0].date);
      setValue(
        "category",
        dailyLogs[0].categoryIds.map((id) => id.toString()) //idはstringでセット
      );
      setValue("memo", dailyLogs[0].memo || "");
    } else {
      reset({
        date: currentDay,
        category: [] as string[], // 初期値を配列にする
        memo: "",
      });
      setCategoryError(false);
    }
  }, [dailyLogs, setValue, currentDay, reset]);

  //カテゴリー選択エラー表示
  useEffect(() => {
    if (errors.category) {
      setCategoryError(true);
    }
  }, [errors]);

  //削除ボタン実行時の処理
  const handleDelete = () => {
    if (dailyLogs.length !== 0) {
      deleteLogsData(dailyLogs[0].id);
      if (isMobile) {
        setIsMobileFormOpen(false);
      }
    }
  };

  //formの中身
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography>入力：どんな日だった？</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                disabled={Boolean(dailyLogs.length !== 0)} // 選択されたログがある場合は日付を変更不可
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={Boolean(errors.date)} // エラーがある場合はtrue
                helperText={errors.date?.message} // エラーメッセージ
              />
            )}
          />

          {/* ポジティブ */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            {/* ラベル（左上に配置） */}
            <Typography
              sx={{
                position: "absolute",
                top: -10,
                left: 12,
                backgroundColor: "white",
                paddingX: "4px",
                fontSize: "11px",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              <ThumbUpAltIcon
                sx={{
                  fontSize: "1rem",
                  color: theme.palette.positiveColor.dark,
                  marginRight: "5px",
                }}
              />
              ポジティブ
            </Typography>
            {/* FormGroup */}

            <FormGroup
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "12px",
                "&:hover": {
                  border: "1px solid #333",
                },
              }}
            >
              {categories &&
                categories.data.map(
                  (category) =>
                    category.type === "positive" && (
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                sx={{
                                  color: "gray", // 通常時のチェックボックスの色
                                  "&.Mui-checked": {
                                    color: theme.palette.positiveColor.dark, // チェック時の色
                                  },
                                  padding: "4px 10px",
                                }}
                                {...field}
                                value={String(category.id)}
                                checked={selectedCategories.includes(
                                  String(category.id) // チェック状態を適切に管理
                                )}
                                onChange={handleChangeCheck} // 変更処理
                              />
                            }
                            label={category.category}
                          />
                        )}
                        key={category.id}
                      />
                    )
                )}
            </FormGroup>
          </Box>
          {/* ネガティブ */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            {/* ラベル（左上に配置） */}
            <Typography
              sx={{
                position: "absolute",
                top: -10,
                left: 12,
                backgroundColor: "white",
                paddingX: "4px",
                fontSize: "11px",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              <ThumbDownAltIcon
                sx={{
                  fontSize: "1rem",
                  color: theme.palette.negativeColor.dark,
                  marginRight: "5px",
                }}
              />
              ネガティブ
            </Typography>
            {/* FormGroup */}
            <FormGroup
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "12px",
                "&:hover": {
                  border: "1px solid #333",
                },
              }}
            >
              {categories &&
                categories.data.map(
                  (category) =>
                    category.type === "negative" && (
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                sx={{
                                  color: "gray", // 通常時のチェックボックスの色
                                  "&.Mui-checked": {
                                    color: theme.palette.negativeColor.dark, // チェック時の色
                                  },
                                  padding: "4px 10px",
                                }}
                                {...field}
                                value={String(category.id)}
                                checked={selectedCategories.includes(
                                  String(category.id) // チェック状態を適切に管理
                                )}
                                onChange={handleChangeCheck} // 変更処理
                              />
                            }
                            label={category.category}
                          />
                        )}
                        key={category.id}
                      />
                    )
                )}
            </FormGroup>
            {categoryError && (
              <Typography color="error">{errors.category?.message}</Typography>
            )}
          </Box>
          {/* メモ欄 */}
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="メモ"
                type="text"
                multiline
                rows={4}
                error={Boolean(errors.memo)} // エラーがある場合はtrue
                helperText={errors.memo?.message} // エラーメッセージ
              />
            )}
          />
          {/*保存・更新ボタン */}
          <Button
            type="submit"
            variant={"contained"}
            sx={{
              boxShadow: "none",
              backgroundColor: theme.palette.primary.dark,
            }}
            fullWidth
          >
            {dailyLogs.length !== 0 ? "更新" : "保存"}
          </Button>
          {/*削除ボタン */}
          {dailyLogs.length !== 0 && (
            <Button
              variant="outlined"
              color={"error"}
              fullWidth
              onClick={handleDelete}
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
  return (
    <>
      {isMobile ? (
        //Mobile用の処理
        <Dialog
          open={isMobileFormOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        //PC用の処理
        <Box
          height="calc(100vh - 64px)" //高さ調整
          sx={{
            position: "fixed",
            top: 64,
            right: isFormOpen ? formWidth : "-2%", // フォームの位置を調整
            width: formWidth,
            overflowY: "auto", // 必要に応じて縦スクロール
            bgcolor: "background.paper",
            zIndex: theme.zIndex.drawer - 1,
            transition: theme.transitions.create("right", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 10px -5px #777777",
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
};
export default TrackerForm;

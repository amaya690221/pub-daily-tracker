// /src/components/TrackerMenu.tsx

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid2,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySummary";
import { CategoriesData, Log } from "../types";
import { formatLogs } from "../utils/calculations";

type Props = {
  dailyLogs: Log[];
  currentDay: string;
  categories: CategoriesData;
  handleAddForm: () => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  handleCloseMobileMenu: () => void;
};

const TransactionMenu = ({
  dailyLogs,
  currentDay,
  categories,
  handleAddForm,
  isMobile,
  isMobileMenuOpen,
  handleCloseMobileMenu,
}: Props) => {
  const theme = useTheme();
  const menuDrawerWidth = 320;
  const dailyEvent = formatLogs(dailyLogs, categories);
  console.log("dailyEvent", dailyEvent);

  return (
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,

          ...(isMobile && {
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor={isMobile ? "bottom" : "right"}
      open={isMobileMenuOpen} //isMobileMenuOpenに変更
      onClose={handleCloseMobileMenu} //メニューのクローズ処理
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        <Typography fontWeight={"fontWeightBold"}>
          日時： {currentDay}
        </Typography>
        <DailySummary dailyLogs={dailyLogs} categories={categories} />
        {/* 内容タイトル&内容追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内容</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={handleAddForm}
          >
            内容を追加
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="登録履歴">
            <Stack spacing={2}>
              {/* ポジティブ表示 */}
              {dailyEvent &&
                dailyEvent.length > 0 &&
                dailyEvent[0].positive.map((posi: string, index: number) => (
                  <ListItem disablePadding key={index}>
                    <Card
                      sx={{
                        width: "100%",
                        backgroundColor: theme.palette.positiveColor.light,
                        boxShadow: "none",
                        border: `1px solid ${theme.palette.positiveColor.main}`,
                      }}
                      onClick={handleAddForm} //追加：onClickでhandleAddFormを実行
                    >
                      <CardActionArea>
                        <CardContent sx={{ padding: "8px" }}>
                          <Grid2
                            container
                            spacing={1}
                            alignItems="center"
                            wrap="wrap"
                          >
                            <Grid2 size={1}>
                              {/* icon */}
                              <ThumbUpAltIcon
                                sx={{
                                  color: theme.palette.positiveColor.dark,
                                }}
                              />
                            </Grid2>
                            <Grid2 size={10} ml={2}>
                              <Typography variant="body2" gutterBottom>
                                {posi}
                              </Typography>
                            </Grid2>
                          </Grid2>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </ListItem>
                ))}
              {/* ネガティブ表示 */}
              {dailyEvent &&
                dailyEvent.length > 0 &&
                dailyEvent[0].negative.map((nega: string, index: number) => (
                  <ListItem disablePadding key={index}>
                    <Card
                      sx={{
                        width: "100%",
                        backgroundColor: theme.palette.negativeColor.light,
                        boxShadow: "none",
                        border: `1px solid ${theme.palette.negativeColor.main}`,
                      }}
                      onClick={handleAddForm} //追加：onClickでhandleAddFormを実行
                    >
                      <CardActionArea>
                        <CardContent sx={{ padding: "8px" }}>
                          <Grid2
                            container
                            spacing={1}
                            alignItems="center"
                            wrap="wrap"
                          >
                            <Grid2 size={1}>
                              {/* icon */}
                              <ThumbDownAltIcon
                                sx={{
                                  color: theme.palette.negativeColor.dark,
                                }}
                              />
                            </Grid2>
                            <Grid2 size={10} ml={2}>
                              <Typography variant="body2" gutterBottom>
                                {nega}
                              </Typography>
                            </Grid2>
                          </Grid2>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </ListItem>
                ))}
              {/* メモ欄 */}
              {dailyLogs && dailyLogs.length > 0 && dailyLogs[0].memo && (
                <ListItem disablePadding>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor: theme.palette.grey[50],
                      boxShadow: "none",
                      border: `1px solid ${theme.palette.grey[300]}`,
                    }}
                    onClick={handleAddForm} //追加：onClickでhandleAddFormを実行
                  >
                    <CardActionArea>
                      <CardContent sx={{ padding: "8px" }}>
                        <Grid2
                          container
                          spacing={1}
                          alignItems="center"
                          wrap="wrap"
                        >
                          <Grid2 size={12}>
                            <Typography variant="body2" gutterBottom>
                              {dailyLogs[0].memo}
                            </Typography>
                          </Grid2>
                        </Grid2>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              )}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default TransactionMenu;

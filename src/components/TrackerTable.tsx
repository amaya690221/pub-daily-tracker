// /src/components/TrackerTable.tsx
//登録データの一覧表示コンポーネント

import { useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid2 } from "@mui/material";
import { Log } from "../types";
import { compareDesc, parseISO } from "date-fns";

interface TrackerTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

// テーブルヘッダのコンポーネント
function TrackerTableHead(props: TrackerTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>ポジティブ</TableCell>
        <TableCell align={"left"}>ネガティブ</TableCell>
        <TableCell align={"left"}>メモ</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface TrackerTableToolbarProps {
  numSelected: number;
  handleDelete: () => void; //props型定義追加
}

// ツールバーのコンポーネント
function TrackerTableToolbar(props: TrackerTableToolbarProps) {
  const { numSelected, handleDelete } = props; //props追加
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の統計
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          {/* onClickでhandleDelete実行 */}
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

//月間サマリーコンポーネント
type SummaryItemProps = {
  title: string;
  value: number;
  color: string;
};

function SummaryItem({ title, value, color }: SummaryItemProps) {
  return (
    <Grid2 size={4} textAlign={"center"}>
      <Typography variant="subtitle1" component={"div"}>
        {title}
      </Typography>
      <Typography
        component={"span"}
        fontWeight={"fontWeightBold"}
        sx={{
          color: color,
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
          wordBreak: "break-word",
        }}
        color={color}
      >
        {value}
      </Typography>
    </Grid2>
  );
}

// メインのコンポーネント
type Props = {
  monthlyTotal: {
    logs: {
      id: string;
      date: string;
      positive: number;
      negative: number;
    }[];
    totalPositive: number;
    totalNegative: number;
    totalDays: number;
  };
  monthlyEvent: {
    start: string;
    positive: string[];
    negative: string[];
  }[];
  monthlyLogs: Log[];
  deleteLogsData: (ids: string | string[]) => Promise<null | undefined>;
};

export default function TrackerTable({
  monthlyTotal,
  monthlyEvent,
  monthlyLogs,
  deleteLogsData,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyLogs.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  //選択したデータを削除する処理
  const handleDelete = () => {
    deleteLogsData(selected);
    setSelected([]);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - monthlyLogs.length) : 0;

  const visibleRows = useMemo(() => {
    const monthlyEventAddIdMemo = monthlyEvent.map((event) => {
      // `event.start` に対応するmonthlyLogsのデータ を抽出し、`id` と `memo` を追加
      const relatedLog = monthlyLogs.find((log) => log.date === event.start);
      return {
        ...event,
        id: relatedLog?.id || "", // id をセット
        memo: relatedLog?.memo || "", // `memo` があればセット、なければ空文字
      };
    });
    return (
      monthlyEventAddIdMemo
        .sort(
          (a, b) => compareDesc(parseISO(a.start), parseISO(b.start)) // 日付の降順でソート
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? []
    );
  }, [page, rowsPerPage, monthlyEvent, monthlyLogs]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} variant="outlined">
        {/* 月間統計表示 */}
        <Grid2
          container
          sx={{
            borderBottom: "1px solid rgba(236,236,236,1)",
            padding: "10px",
          }}
        >
          <SummaryItem
            title="ポジティブ"
            value={monthlyTotal.totalPositive}
            color={theme.palette.positiveColor.dark}
          />
          <SummaryItem
            title="ネガティブ"
            value={monthlyTotal.totalNegative}
            color={theme.palette.negativeColor.dark}
          />
          <SummaryItem
            title="記録した日数"
            value={monthlyTotal.totalDays}
            color={theme.palette.daysColor.dark}
          />
        </Grid2>

        {/* ツールバー */}
        <TrackerTableToolbar
          numSelected={selected.length}
          handleDelete={handleDelete} //props追加
        />

        {/* テーブル本体 */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            {/* テーブルヘッダ */}
            <TrackerTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthlyLogs.length}
            />

            {/* テーブルの中身（ボディ） */}
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer", verticalAlign: "top" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">
                      <Box sx={{ whiteSpace: "nowrap" }}> {row.start}</Box>
                    </TableCell>
                    <TableCell align="left">
                      {row.positive.map((posi, i) => (
                        <Box
                          color={theme.palette.positiveColor.dark}
                          sx={{ whiteSpace: "nowrap" }}
                          key={i}
                        >
                          {posi}
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell align="left">
                      {row.negative.map((nega, i) => (
                        <Box
                          color={theme.palette.negativeColor.dark}
                          sx={{ whiteSpace: "nowrap" }}
                          key={i}
                        >
                          {nega}
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ inlineSize: "40vw", wordBreak: "break-word" }}
                    >
                      {row.memo}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ページネーション */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={monthlyLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* 間隔調整スイッチ */}
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="間隔を狭く"
      />
    </Box>
  );
}

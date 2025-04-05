// /src/App.tsx

import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import Layout from "./pages/Layout";
import { ThemeProvider } from "@emotion/react";
import { Alert, CssBaseline, Snackbar } from "@mui/material";
import { theme } from "./theme/theme";
import { CategoriesData, Log } from "./types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./utils/firebase";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";

function App() {
  const [categories, setCategories] = useState<CategoriesData>({ data: [] });
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notify, setNotify] = useState<{
    message: string;
    severity: "error" | "success";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /*** Firestoreエラーかどうかを判定する型ガード ***/
  function isFirestoreError(
    err: unknown
  ): err is { code: string; message: string } {
    //errはオブジェクト形式であり、それぞれの型を明示
    return typeof err === "object" && err !== null && "code" in err;
  }

  /*** Firebaseデータ（categories）取得 ***/
  // https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja#get_a_document
  const getCategoriesData = async (setId: string) => {
    try {
      const userDocRef = doc(db, "categories", setId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data() as CategoriesData; // 型アサーションを利用
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (err) {
      if (isFirestoreError(err)) {
        //Firestoreエラーの場合
        console.error("Firebaseのエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
      return null;
    }
  };

  /*** Firebaseデータ（log）取得***/
  //https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja#get_all_documents_in_a_collection
  const getLogsData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "log"));
      console.log("querySnapshot", querySnapshot);
      const logsData = querySnapshot.docs.map((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        return {
          ...doc.data(),
          id: doc.id,
        } as Log; //型アサーション
      });
      console.log("logs", logsData);
      setLogs(logsData);
    } catch (err) {
      if (isFirestoreError(err)) {
        //Firestoreエラーの場合
        console.error("Firebaseのエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  //DBデータ、categories, logを、コンポーネントマウント時取得
  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesData = await getCategoriesData("default");
      if (categoriesData) {
        console.log("receiveData", categoriesData);
        setCategories(categoriesData);
      }
    };
    fetchCategoriesData()
      .then(() => {
        //.thenに変更
        getLogsData();
      })
      .catch((err) => {
        console.error("データ取得エラー:", err);
      });
  }, []);

  //今月のlogデータのみをフォーマット変換の上、取得する処理
  const monthlyLogs = logs.filter((log) => {
    return log.date.startsWith(formatMonth(currentMonth));
  });
  console.log("monthlyLogs", monthlyLogs);

  /*** Firestoreデータ登録処理 ***/
  const saveLogsData = async (data: Schema) => {
    try {
      //Firestoreにデータを保存
      //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja#add_a_document
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "log"), {
        date: data.date,
        categoryIds: data.category.map((cat) => parseInt(cat, 10)), // 文字列を数値（10進数）に変換
        memo: data.memo,
      });
      console.log("Document written with ID: ", docRef.id);

      try {
        await getLogsData(); // 登録後、データ全体を再取得
        setNotify({
          message: "データを保存しました",
          severity: "success",
        });
      } catch (err) {
        // データ取得エラーの場合
        console.error("データ再取得エラー:", err);
        setNotify({
          message: "データは保存されましたが、最新データの取得に失敗しました",
          severity: "error",
        });
      }
    } catch (err) {
      if (isFirestoreError(err)) {
        //Firestoreエラーの場合
        console.error("Firebaseのエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
        setNotify({
          message: `データの保存に失敗しました。${err.message}`,
          severity: "error",
        });
      } else {
        console.error("一般的なエラーは:", err);
        setNotify({
          message: "データの保存に失敗しました",
          severity: "error",
        });
      }
      return null;
    }
  };

  /*** Firestoreデータ削除処理 ***/
  // const deleteLogsData = async (id: string) => {
  const deleteLogsData = async (ids: string | string[]) => {
    try {
      const idsToDelete = Array.isArray(ids) ? ids : [ids]; //配列かどうか判定し、配列でない場合は配列に変換
      //idsToDeleteの要素を1つずつ取り出し、idに代入
      for (const id of idsToDelete) {
        //Firestoreデータ削除処理
        //https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ja#delete_documents
        await deleteDoc(doc(db, "log", id));
      }
      try {
        await getLogsData(); // 登録後、データ全体を再取得
        setNotify({
          message: "データを削除しました",
          severity: "success",
        });
      } catch (err) {
        // データ取得エラーの場合
        console.error("データ再取得エラー:", err);
        setNotify({
          message: "データは削除されましたが、最新データの取得に失敗しました",
          severity: "error",
        });
      }
    } catch (err) {
      if (isFirestoreError(err)) {
        //Firestoreエラーの場合
        console.error("Firebaseのエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
        setNotify({
          message: `データの削除に失敗しました。${err.message}`,
          severity: "error",
        });
      } else {
        console.error("一般的なエラーは:", err);
        setNotify({
          message: "データの削除に失敗しました",
          severity: "error",
        });
      }
      return null;
    }
  };

  /*** Firestoreデータ更新処理 ***/
  const updateLogsData = async (data: Schema, id: string) => {
    try {
      //Firestoreデータ更新処理
      //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja#update-data
      const updateRef = doc(db, "log", id);
      await updateDoc(updateRef, {
        date: data.date,
        categoryIds: data.category.map((cat) => parseInt(cat, 10)), // 文字列を数値（10進数）に変換
        memo: data.memo,
      });
      try {
        await getLogsData(); // 登録後、データ全体を再取得
        setNotify({
          message: "データを更新しました",
          severity: "success",
        });
      } catch (err) {
        // データ取得エラーの場合
        console.error("データ再取得エラー:", err);
        setNotify({
          message: "データは更新されましたが、最新データの取得に失敗しました",
          severity: "error",
        });
      }
    } catch (err) {
      if (isFirestoreError(err)) {
        //Firestoreエラーの場合
        console.error("Firebaseのエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
        setNotify({
          message: `データの更新に失敗しました。${err.message}`,
          severity: "error",
        });
      } else {
        console.error("一般的なエラーは:", err);
        setNotify({
          message: "データの更新に失敗しました",
          severity: "error",
        });
      }
      return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Home
                  monthlyLogs={monthlyLogs}
                  categories={categories}
                  setCurrentMonth={setCurrentMonth}
                  saveLogsData={saveLogsData}
                  deleteLogsData={deleteLogsData}
                  updateLogsData={updateLogsData}
                />
              }
            />
            <Route
              path="/report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyLogs={monthlyLogs}
                  categories={categories}
                  isLoading={isLoading}
                  deleteLogsData={deleteLogsData}
                />
              }
            />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
      {/* Snackbar追加 */}
      <Snackbar
        open={Boolean(notify)}
        autoHideDuration={4000}
        onClose={() => setNotify(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotify(null)}
          severity={notify?.severity || "error"}
        >
          {notify?.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;

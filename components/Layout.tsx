import React, { ReactNode } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Footer from "./Footer";
import { useRouter } from "next/router";
import Header from './Header'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ProfileModal from "./Modals/ProfileModal";
import FormEditUserModal from "./Modals/FormEditUserModal";
import FormTransactionsModal from "./Modals/FormTransactionsModal";
import TransactionDetail from "./Transactions/TransactionDetail";
import NotificationDetail from "./Notifications/NotificationDetail";
import BackdropModal from "./Modals/BackdropModal";
import PaymentModal from "./Modals/PaymentModal";
import OrderProductModal from "./Modals/OrderProductModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dynamic from "next/dynamic";
import { setOpenSnackBar } from "../redux/features/isSlice";
import { getCookie } from "cookies-next";
const ChatBox = dynamic(() => import("./ChatBox"), { ssr: false })


interface LayoutProps {
  children: ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  const token = getCookie("token")
  const router = useRouter()
  const dispatch = useDispatch()
  const { isOpenFormEditUser, isOpenNotificationDetail, isOpenSnackbar, isOpenFormTransaction, isOpenTransactionDetail, isOpenBackdropModal, isOpenProfileModal, isOpenPaymentModal, isOpenOrderProduct, isLoading }: any = useSelector<RootState>(state => state.is)
  const { contentSnackBar }: any = useSelector<RootState>(state => state.user)

  return (
    <div className="w-full !h-screen">
      {isOpenProfileModal && <ProfileModal />}
      {isOpenFormEditUser && <FormEditUserModal />}
      {isOpenFormTransaction && <FormTransactionsModal />}
      {isOpenTransactionDetail && <TransactionDetail />}
      {isOpenBackdropModal && <BackdropModal />}
      {isOpenPaymentModal && <PaymentModal />}
      {isOpenNotificationDetail && <NotificationDetail />}
      {isOpenOrderProduct && <OrderProductModal />}
      {token && !isLoading && router.asPath !== "/owner/manager" && router.asPath !== "/admin/manager" && <ChatBox />}
      <Snackbar open={isOpenSnackbar} autoHideDuration={500} onClose={() => dispatch(setOpenSnackBar(false))}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {contentSnackBar}
        </Alert>
      </Snackbar>

      <Head>
        <title>Sport Yard</title>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="icon" href="/goal.png" />
      </Head>
      <Header />
      <main className="!bg-white w-full">{children}</main>
      {router.asPath !== '/admin/manager' && router.asPath !== '/owner/manager' &&
        <Footer />
      }
    </div>
  );
};

export default Layout;

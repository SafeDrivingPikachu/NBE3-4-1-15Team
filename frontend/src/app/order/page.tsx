"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/api";

// 주문상품 DTO (옵션)
interface OrderProductDto {
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
}

// 주문 DTO
interface OrderDto {
    id: number;
    consumerId: number;
    orderType: string;   // ORDERED, PAID, DELIVERY ...
    totalPrice: number;
    order_date: string;
    orderProducts?: OrderProductDto[]; // 주문 상품 목록 (필요시)
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [status, setStatus] = useState("");

    // 주문 상태를 한글로 매핑하는 객체
    const orderStatusMap: { [key: string]: string } = {
        ORDERED: "주문 완료",
        PAID: "결제 완료",
        DELIVERY: "배송 중",
        CANCELED: "취소됨"
    };

    // 주문 시간을 "YYYY년 MM월 DD일 HH시 mm분" 형식으로 바꾸는 함수
    const formatOrderDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        const year = date.getFullYear();
        // 0부터 시작하므로 +1
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        // 예: "2025년 01월 21일 03시 33분"
        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    };

    const fetchOrders = async () => {
        try {
            // /user/orders/mem -> OrderDto[] 형태 응답 가정
            const response = await apiClient.get("/user/orders/mem");
            console.log("주문 내역:", response.data);
            setOrders(response.data);
            setStatus("주문 목록 가져오기 성공");
        } catch (error: any) {
            console.error("주문 내역 조회 실패:", error);
            setStatus(
                "주문 목록 가져오기 실패: " + (error.response?.data?.msg || error.message)
            );
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <h1 style={styles.title}>주문 페이지</h1>
                <button style={styles.button} onClick={fetchOrders}>
                    주문 목록 가져오기
                </button>
                <p style={styles.status}>{status}</p>

                <div style={styles.orders}>
                    {orders.length > 0 ? (
                        orders.map((order, idx) => {
                            // OrderType -> 한글 상태
                            const orderStatus = orderStatusMap[order.orderType] || order.orderType;
                            // 주문 시간 포맷
                            const formattedDate = formatOrderDate(order.order_date);

                            return (
                                <div key={idx} style={styles.orderItem}>
                                    <p>
                                        <strong>주문 ID:</strong> {order.id}
                                    </p>
                                    <p>
                                        <strong>주문 상태:</strong> {orderStatus}
                                    </p>
                                    <p>
                                        <strong>총 금액:</strong> {order.totalPrice}원
                                    </p>
                                    <p>
                                        <strong>주문 시각:</strong> {formattedDate}
                                    </p>
                                    <hr style={styles.divider} />
                                </div>
                            );
                        })
                    ) : (
                        <p>주문이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as const,
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
    },
    section: {
        width: "80%",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "20px",
        color: "#333",
    },
    button: {
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
    },
    status: {
        fontSize: "1rem",
        color: "#007bff",
        marginBottom: "20px",
    },
    orders: {
        maxHeight: "400px",
        overflowY: "auto" as const,
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
    },
    orderItem: {
        padding: "10px",
        marginBottom: "5px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "5px",
        color: "#333",
        wordWrap: "break-word" as const,
    },
    divider: {
        marginTop: "10px",
        border: "none",
        borderTop: "1px solid #eee",
    },
};
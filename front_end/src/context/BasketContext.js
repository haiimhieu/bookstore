import React, { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [basket, setBasket] = useState(() => {
        // Load from localStorage on initial render
        const stored = localStorage.getItem('basket');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        // Sync basket to localStorage on any update
        localStorage.setItem('basket', JSON.stringify(basket));
    }, [basket]);

    const addToBasket = (book) => {
        setBasket(prev => {
            const existing = prev.find(item => item.book_id === book.book_id);
            if (existing) {
                return prev.map(item =>
                    item.book_id === book.book_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...book, quantity: 1 }];
        });
    };

    const removeFromBasket = (bookId) => {
        setBasket(prev => prev.filter(item => item.book_id !== bookId));
    };

    const clearBasket = () => {
        setBasket([]);
    };

    const updateQuantity = (bookId, newQuantity) => {
        setBasket(prev =>
            prev.map(item =>
                item.book_id === bookId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );
    };

    return (
        <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, clearBasket, updateQuantity }}>
            {children}
        </BasketContext.Provider>
    );
}

export const useBasket = () => useContext(BasketContext);
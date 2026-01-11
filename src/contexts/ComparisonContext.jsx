/**
 * Property Comparison Context
 * Manages comparison state across the app
 */
import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within ComparisonProvider');
    }
    return context;
}

export function ComparisonProvider({ children }) {
    const [compareList, setCompareList] = useState(() => {
        // Load from localStorage on init
        const saved = localStorage.getItem('compareList');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever compareList changes
    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (project) => {
        if (compareList.length >= 3) {
            return { success: false, message: 'You can compare up to 3 properties only' };
        }

        if (compareList.find(p => p.id === project.id)) {
            return { success: false, message: 'Property already in comparison' };
        }

        setCompareList([...compareList, project]);
        return { success: true, message: 'Added to comparison' };
    };

    const removeFromCompare = (projectId) => {
        setCompareList(compareList.filter(p => p.id !== projectId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (projectId) => {
        return compareList.some(p => p.id === projectId);
    };

    return (
        <ComparisonContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isInCompare,
                compareCount: compareList.length,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
}

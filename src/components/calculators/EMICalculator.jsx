/**
 * EMI Calculator Component
 * Calculates monthly loan payments
 */
import { useState } from 'react';
import './EMICalculator.css';

export default function EMICalculator({ propertyPrice: initialPrice = 0 }) {
    const [loanAmount, setLoanAmount] = useState(initialPrice * 0.8 || 5000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const calculateEMI = () => {
        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate) / 12 / 100; // Monthly rate
        const time = parseFloat(tenure) * 12; // Total months

        if (principal <= 0 || rate <= 0 || time <= 0) return 0;

        const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();
    const totalAmount = emi * tenure * 12;
    const totalInterest = totalAmount - loanAmount;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    return (
        <div className="emi-calculator">
            <h3 className="emi-calculator__title">EMI Calculator</h3>

            <div className="emi-calculator__inputs">
                {/* Loan Amount */}
                <div className="emi-input">
                    <label className="emi-input__label">
                        Loan Amount
                        <span className="emi-input__value">{formatCurrency(loanAmount)}</span>
                    </label>
                    <input
                        type="range"
                        min="100000"
                        max="50000000"
                        step="100000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="emi-input__range"
                    />
                    <div className="emi-input__limits">
                        <span>₹1L</span>
                        <span>₹5Cr</span>
                    </div>
                </div>

                {/* Interest Rate */}
                <div className="emi-input">
                    <label className="emi-input__label">
                        Interest Rate (p.a.)
                        <span className="emi-input__value">{interestRate}%</span>
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="15"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="emi-input__range"
                    />
                    <div className="emi-input__limits">
                        <span>5%</span>
                        <span>15%</span>
                    </div>
                </div>

                {/* Tenure */}
                <div className="emi-input">
                    <label className="emi-input__label">
                        Loan Tenure
                        <span className="emi-input__value">{tenure} Years</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        className="emi-input__range"
                    />
                    <div className="emi-input__limits">
                        <span>1 Yr</span>
                        <span>30 Yrs</span>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="emi-results">
                <div className="emi-result emi-result--primary">
                    <div className="emi-result__label">Monthly EMI</div>
                    <div className="emi-result__value">{formatCurrency(emi)}</div>
                </div>

                <div className="emi-result-grid">
                    <div className="emi-result">
                        <div className="emi-result__label">Principal Amount</div>
                        <div className="emi-result__value">{formatCurrency(loanAmount)}</div>
                    </div>

                    <div className="emi-result">
                        <div className="emi-result__label">Total Interest</div>
                        <div className="emi-result__value emi-result__value--interest">
                            {formatCurrency(totalInterest)}
                        </div>
                    </div>

                    <div className="emi-result">
                        <div className="emi-result__label">Total Amount</div>
                        <div className="emi-result__value">{formatCurrency(totalAmount)}</div>
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="emi-chart">
                <div className="emi-chart__pie">
                    <svg viewBox="0 0 32 32" className="emi-pie">
                        <circle
                            r="16"
                            cx="16"
                            cy="16"
                            fill="transparent"
                            stroke="#FF6B35"
                            strokeWidth="32"
                            strokeDasharray={`${(loanAmount / totalAmount) * 100} ${100 - (loanAmount / totalAmount) * 100}`}
                            transform="rotate(-90 16 16)"
                        />
                        <circle
                            r="16"
                            cx="16"
                            cy="16"
                            fill="transparent"
                            stroke="#3B82F6"
                            strokeWidth="32"
                            strokeDasharray={`${(totalInterest / totalAmount) * 100} ${100 - (totalInterest / totalAmount) * 100}`}
                            strokeDashoffset={`-${(loanAmount / totalAmount) * 100}`}
                            transform="rotate(-90 16 16)"
                        />
                    </svg>
                </div>

                <div className="emi-legend">
                    <div className="emi-legend__item">
                        <span className="emi-legend__dot emi-legend__dot--principal"></span>
                        Principal ({Math.round((loanAmount / totalAmount) * 100)}%)
                    </div>
                    <div className="emi-legend__item">
                        <span className="emi-legend__dot emi-legend__dot--interest"></span>
                        Interest ({Math.round((totalInterest / totalAmount) * 100)}%)
                    </div>
                </div>
            </div>
        </div>
    );
}

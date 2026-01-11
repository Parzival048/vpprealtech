/**
 * Content Scheduler Component
 * Schedule posts for future publication
 */
import { useState } from 'react';
import Button from '../ui/Button';
import './ContentScheduler.css';

export default function ContentScheduler({ onSchedule, currentSchedule }) {
    const [scheduledDate, setScheduledDate] = useState(currentSchedule || '');
    const [scheduledTime, setScheduledTime] = useState('09:00');

    const handleSchedule = () => {
        if (!scheduledDate) {
            alert('Please select a date');
            return;
        }

        const scheduleDateTime = `${scheduledDate}T${scheduledTime}:00`;
        onSchedule(scheduleDateTime);
    };

    const handlePublishNow = () => {
        onSchedule(null); // null means publish immediately
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="content-scheduler">
            <h4 className="content-scheduler__title">Publishing Schedule</h4>

            <div className="content-scheduler__inputs">
                <div className="scheduler-input">
                    <label className="scheduler-input__label">Date</label>
                    <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={getMinDate()}
                        className="scheduler-input__field"
                    />
                </div>

                <div className="scheduler-input">
                    <label className="scheduler-input__label">Time</label>
                    <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="scheduler-input__field"
                    />
                </div>
            </div>

            {scheduledDate && (
                <div className="content-scheduler__preview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                        Will publish on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </span>
                </div>
            )}

            <div className="content-scheduler__actions">
                <Button
                    variant="outline"
                    onClick={handleSchedule}
                    disabled={!scheduledDate}
                >
                    Schedule for Later
                </Button>
                <Button
                    variant="primary"
                    onClick={handlePublishNow}
                >
                    Publish Now
                </Button>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";
import Textarea from "../../components/Textarea";
import Typography from "../../components/Typography";

interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPrompt: string) => void;
    currentPrompt: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentPrompt,
}) => {
    const [localPrompt, setLocalPrompt] = useState(currentPrompt);

    useEffect(() => {
        setLocalPrompt(currentPrompt);
    }, [currentPrompt]);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        onSave(localPrompt);
        onClose();
    };

    const handleCancel = () => {
        setLocalPrompt(currentPrompt); // 변경 사항 되돌리기
        onClose();
    };

    return (
        // 1. 모달 배경 (Overlay)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleCancel} // 배경 클릭 시 닫기
        >
            {/* 2. 모달 컨텐츠 (Card) */}
            <Card
                className="w-full max-w-lg"
                onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫기 방지
            >
                <div className="space-y-4">
                    <SectionTitle className="text-gray-900 dark:text-gray-900">
                        Edit AI Summary Prompt
                    </SectionTitle>

                    <Textarea
                        id="prompt-textarea"
                        label="Custom Prompt"
                        className="[&_label]:text-gray-900 dark:[&_label]:text-gray-900"
                        value={localPrompt}
                        onChange={(e) => setLocalPrompt(e.target.value)}
                        rows={10}
                        placeholder="e.g., Summarize this commit in one sentence."
                    />

                    <Typography
                        variant="meta"
                        className="text-gray-500 dark:text-gray-500"
                    >
                        Note: The commit message will be automatically appended
                        to your prompt.
                    </Typography>

                    {/* 3. 버튼 (Button) */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Prompt
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PromptModal;

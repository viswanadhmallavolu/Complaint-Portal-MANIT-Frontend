import React, { useState } from 'react';

interface TagInputProps {
    label: string;
    placeholder: string;
    tags: string[];
    onChange: (newTags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ label, placeholder, tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const handleAddTagManual = () => {
        if (inputValue.trim()) {
            onChange([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveTag = (idx: number) => {
        const newTags = [...tags];
        newTags.splice(idx, 1);
        onChange(newTags);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, i) => (
                    <div key={i} className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {tag}
                        <button onClick={() => handleRemoveTag(i)} className="ml-2 text-red-500 text-sm">X</button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={handleAddTagManual} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Add
                </button>
            </div>
        </div>
    );
};

export default TagInput;

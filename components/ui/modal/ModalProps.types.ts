export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
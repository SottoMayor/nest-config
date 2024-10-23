export default interface ResponseService<T> {
    data: T;
    message?: string;
    success?: boolean;
}
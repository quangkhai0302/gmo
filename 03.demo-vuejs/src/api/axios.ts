import api from "./authAPI.ts";

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
    errors?: Record<string, string> | null;
}

export interface RegisterRequest {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthUserResponse {
    id: number;
    username: string;
}

export interface AuthTokenResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUserResponse;
}

export interface AuthRefreshRequest {
    refreshToken: string;
}

export interface AuthRefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface Student {
    id: number;
    code: string;
    name: string;
    birthday: string | null;
    address: string | null;
    score: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface StudentPageResponse {
    items: Student[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

export interface StudentDetailResponse {
    studentId: number;
    studentCode: string;
    studentName: string;
    birthday: string;
    address: string;
    averageScore: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface ActivityLogResponse {
    id: number;
    type: string;
    title: string;
    description: string | null;
    referenceType: string | null;
    referenceId: number | null;
    createdAt: string | null;
}

export interface StudentSearchParams {
    studentCode?: string;
    studentName?: string;
    birthday?: string;
    page?: number;
    size?: number;
    sortField?: "id" | "code" | "name" | "birthday" | "score";
    sortOrder?: "asc" | "desc";
}

export interface StudentCreateRequest {
    studentCode: string;
    studentName: string;
    birthday: string;
    address?: string;
    averageScore?: number | null;
}

export interface StudentUpdateRequest {
    studentName: string;
    birthday: string;
    address?: string;
    averageScore?: number | null;
}

export interface StudentExportRunResponse {
    jobExecutionId: number;
    status: string;
    outputFile: string;
}


export const registerApi = async (data: RegisterRequest): Promise<ApiResponse<AuthTokenResponse>> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
}

export const loginApi = async (data: LoginRequest): Promise<ApiResponse<AuthTokenResponse>> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
}

export const refreshTokenApi = async (data: AuthRefreshRequest): Promise<ApiResponse<AuthRefreshResponse>> => {
    const response = await api.post('/api/auth/refresh', data);
    return response.data;
}

export const logoutApi = async(accessToken: string) => {
    const response = await api.post('/api/auth/logout', null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.data;
}

export const getStudentsApi = async (
    params: StudentSearchParams
): Promise<ApiResponse<StudentPageResponse>> => {
    const response = await api.get('/api/students', { params });
    return response.data;
}

export const getStudentDetailApi = async (
    studentId: number
): Promise<ApiResponse<StudentDetailResponse>> => {
    const response = await api.get(`/api/students/${studentId}`);
    return response.data;
}

export const generateStudentCodeApi = async (): Promise<ApiResponse<string>> => {
    const response = await api.get('/api/students/generate-student-code');
    return response.data;
}

export const createStudentApi = async (
    data: StudentCreateRequest
): Promise<ApiResponse<StudentDetailResponse>> => {
    const response = await api.post('/api/students', data);
    return response.data;
}

export const updateStudentApi = async (
    studentId: number,
    data: StudentUpdateRequest
): Promise<ApiResponse<StudentDetailResponse>> => {
    const response = await api.put(`/api/students/${studentId}`, data);
    return response.data;
}

export const deleteStudentApi = async (studentId: number): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/api/students/${studentId}`);
    return response.data;
}

export const runStudentExportBatchApi = async (): Promise<ApiResponse<StudentExportRunResponse>> => {
    const response = await api.post('/batch/export-students/run');
    return response.data;
}

export const getActivityLogsApi = async (
    size = 10
): Promise<ApiResponse<ActivityLogResponse[]>> => {
    const response = await api.get('/api/activities', { params: { size } });
    return response.data;
}

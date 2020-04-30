import { Project } from "./Project";

export abstract class ProjectService {

    /**
     * 获取全部数据
     */
    abstract selectAll(): Promise<Project[]>

    abstract insertTest(): Promise<number>

    abstract insertBatchTest(): Promise<number>

    abstract updateTest(): Promise<number>

    abstract delete(): Promise<number>
}
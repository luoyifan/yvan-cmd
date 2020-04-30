/**
 * 项目实体
 */
@Server.TableName("wt_project")
export default class Project {

    @Server.IdField('project_id')
    projectId!: number;

    @Server.TableField('framwork_id')
    framworkId!: string;

    @Server.TableField('project_name')
    projectName!: string;

    @Server.TableField('create_at', {insertIgnore: true, updateIgnore: true})
    createAt!: string;

    @Server.TableField('update_at', {insertIgnore: true, updateIgnore: true})
    updateAt!: string;
}
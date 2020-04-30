import Project from './Project';
import ProjectDao from './ProjectDao'

@Server.Service
export default class ProjectService {

    @Server.Inject
    projectDao!: ProjectDao;

    /**
     * 获取全部数据
     */
    selectAll(): Project[] {
        console.log('selectAll');
        return this.projectDao.selectAll();
    }

    insertTest() {
        const p = new Project();
        p.projectId = 10002;
        p.framworkId = "1002";
        p.projectName = "测试2";
        // p.createAt=new JodaTime();
        // p.updateAt=new JodaTime();
        return this.projectDao.insert(p);
    }

    insertBatchTest() {
        const p = new Project();
        p.projectId = 10000;
        p.framworkId = "100"
        p.projectName = "测试111"
        // p.createAt=new JodaTime();
        // p.updateAt=new JodaTime();

        const p1 = new Project();
        p1.projectId = 10001;
        p1.framworkId = "101"
        p1.projectName = "测试222"
        // p1.createAt=new JodaTime();
        // p1.updateAt=new JodaTime();

        let list: Project[] = []
        list.push(p);
        list.push(p1)

        return this.projectDao.insertBatch(list);
    }

    esQuery() {
        return Server.esQuery('/_search', {
            "size": 0,
            "query": {
                "match_all": {}
            },
        });
    }

    updateTest() {
        const p = new Project();
        p.projectId = 10000;
        p.projectName="测试update2"
        return this.projectDao.updateById(p);
    }
    delete() {
        const p = new Project();
        p.projectId = 10000;
        return this.projectDao.daoDeleteById(p);
    }
}
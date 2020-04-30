import { Project, SourceFile, ClassDeclaration, FunctionDeclaration, Directory, MethodDeclaration } from "ts-morph";
import * as path from 'path'
import * as fs from 'fs'

export function transform(serverSrcPath: string, uiSrcPath: string) {

    // entityConvert("D:\\Projects\\jzt\\flownet2\\jzt-flow\\server\\src\\sys\\Admin.entity.ts", "sys/Admin.entity.ts", uiSrcPath);
    // return;

    // entityConvert("D:\\Projects\\jzt\\flownet2\\jzt-flow\\server\\dist\\sys\\AdminInfo.service.d.ts", "sys/AdminInfo.interface.ts", uiSrcPath);
    // return;

    fs.watch(serverSrcPath, {
        //是否连同其子文件一起监视
        recursive: true
    }, (eventType, relatePath) => {
        relatePath = relatePath.replace(/\\/g, "/");
        const relatePathUpper = relatePath.toUpperCase();
        const absFilePath = path.join(serverSrcPath, relatePath);

        if (relatePathUpper.startsWith('SRC/') && relatePathUpper.endsWith(".SERVICE.TS")) {
            // 改造 service
            serviceConvert(absFilePath, relatePath.substr('SRC/'.length), uiSrcPath);

        } else if (relatePathUpper.startsWith('DIST/') && relatePathUpper.endsWith(".ENTITY.D.TS")) {
            // 改造 entity
            entityConvert(absFilePath, relatePath.substr('SRC/'.length), uiSrcPath);

        } else if (relatePathUpper.startsWith('SRC/') && relatePathUpper.endsWith(".SQL.XML")) {
            // 改造 XML
            sqlXmlConvert(absFilePath, relatePath.substr('SRC/'.length), uiSrcPath);

        } else {
            // 无改造内容
            return;
        }

        console.log('doning finish, Waiting for change.\n');
    })
    console.log('================= Waiting for change. =================');

    return;
}

/**
 * 转换 sql.xml -> dao.ts
 */
function sqlXmlConvert(absFilePath: string, relatePath: string, uiSrcPath: string) {

}

/**
 * 转换 entity.d.ts -> entity.ts
 */
function entityConvert(absFilePath: string, relatePath: string, uiSrcPath: string) {
    // 新建项目
    const serverDistProject = new Project();

    // 计算目标文件名，换后缀
    const targetFilePath = path.join(uiSrcPath, '/' + relatePath);
    console.log(`Entity: ${relatePath}  -> ${targetFilePath}`);

    const sourceFile: SourceFile = serverDistProject.addSourceFileAtPathIfExists(absFilePath);
    const targetFile = sourceFile.copy(targetFilePath, { overwrite: true });

    const classes = targetFile.getClasses()
    classes.forEach((c: ClassDeclaration) => {
        var interfaceStruct = c.extractInterface(`${c.getName()}`);
        c.remove();
        targetFile.addInterface(interfaceStruct);
        const inter = targetFile.getInterfaceOrThrow(interfaceStruct.name);
        inter.setIsExported(true);
        inter.setIsDefaultExport(true);
        inter.addJsDoc({ description: "系统生成,不要更改!" });


        const docs = inter.getJsDocs();
        if (docs.length <= 0) {
            inter.addJsDoc({ description: '实体声明 [请不要修改此文件]' });
        } else {
            if (docs[0].getDescription()) {
                docs[0].setDescription(docs[0].getDescription() + ' [请不要修改此文件]');
            } else {
                docs[0].setDescription('实体声明 [请不要修改此文件]');
            }
        }
    });

    // 保存修改
    serverDistProject.saveSync();
}

/**
 * 转换 service.d.ts -> interface.ts
 */
function serviceConvert(absFilePath: string, relatePath: string, uiSrcPath: string) {
    // 新建项目
    const serverDistProject = new Project();

    // 计算目标文件名，换后缀
    const targetFilePath = path.join(uiSrcPath, '/' + relatePath.substr(0, relatePath.length - '.service.d.ts'.length) + '.interface.ts');
    console.log(`Service: ${relatePath}  -> ${targetFilePath}`);

    const sourceFile: SourceFile = serverDistProject.addSourceFileAtPathIfExists(absFilePath);
    const targetFile = sourceFile.copy(targetFilePath, { overwrite: true });

    const classes = targetFile.getClasses();
    classes.forEach((c: ClassDeclaration) => {

        const methods: MethodDeclaration[] = c.getMethods();

        methods.forEach((f: MethodDeclaration) => {

            var ret = f.getReturnTypeNode();
            if (ret) {
                f.setReturnType("Promise<" + f.getReturnTypeNode().getText() + ">")
            }
            const docs = f.getJsDocs();
            if (docs.length <= 0) {
                f.addJsDoc({ description: '方法声明 [请不要修改此文件]' });
            } else {
                if (docs[0].getDescription()) {
                    docs[0].setDescription(docs[0].getDescription() + ' [请不要修改此文件]');
                } else {
                    docs[0].setDescription('方法声明 [请不要修改此文件]');
                }
            }
            f.setBodyText(`return YvanUI.invokeApi('/${relatePath.substr(0, relatePath.length - '.service.d.ts'.length)}@${f.getName()}', arguments);    `)
        });
    });
    // 修正import
    const targetImports = targetFile.getImportDeclarations();
    targetImports.forEach(c => c.remove());

    const sourceImports = sourceFile.getImportDeclarations().map(c => c.getStructure());
    targetFile.addImportDeclarations(sourceImports);

    // 保存修改
    serverDistProject.saveSync();
}

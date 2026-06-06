import armsRum from '@arms/rum-browser';

armsRum.init({
    endpoint: 'https://proj-xtrace-55fddf418f4bfdfa4a657a12d83ac39-us-west-1.us-west-1.log.aliyuncs.com/rum/web/v2?workspace=default-cms-1485932645905860-us-west-1&service_id=empw17q7yc@05a3290f1c4eadf8e730f',
    // 设置环境信息，参考值：'prod' | 'gray' | 'pre' | 'daily' | 'local'
    env: 'prod',
    // 设置路由模式， 参考值：'history' | 'hash'
    spaMode: 'history',
    collectors: {
        // 页面性能指标监听开关，默认开启
        perf: true,
        // WebVitals指标监听开关，默认开启
        webVitals: true,
        // Ajax监听开关，默认开启
        api: true,
        // 静态资源开关，默认开启
        staticResource: true,
        // JS错误监听开关，默认开启
        jsError: true,
        // 控制台错误监听开关，默认开启
        consoleError: true,
        // 用户行为监听开关，默认开启
        action: true,
    },
    // 链路追踪配置开关，默认关闭
    tracing: false,
});

export default armsRum;
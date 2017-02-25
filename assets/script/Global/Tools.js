/**
 * 全局工具类
 *
 * @author   Make.<makehuir@gmail.com>
 * @link     http://huyaohui.com
 * @link     https://github.com/MakeHui
 *
 * @datetime 2017-02-14 18:51:29
 */
window.Tools = {};

/**
 * 删除数组中的值
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-14T18:36:18+0800
 *
 * @param    {array}                 array 待删除的数组
 * @param    {value}                 value 
 * @return   {bool}
 */
window.Tools.removeArrayInValue = function(array, value) {
    let index = ToolKit.indexOf(arrar, value);
    if (index > -1) {
        arrar.splice(index, 1);
        return true;
    }
    
    return false;
};

/**
 * 递归查询当前节点下的指定名称的子节点
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-14T18:37:45+0800
 *
 * @param    {node}                 node 父节点
 * @param    {string}                 name 子节点名称
 * @return   {node}
 */
window.Tools.seekNodeByName = function(node, name) {
    let children = node.children;
    for (let i = 0; i < children.length; ++i) {
        cc.log(children[i].name);
        if (children[i].name !== name) {
            var childrenNode = window.Tools.seekNodeByName(children[i], name);
            if (childrenNode) {
                return node;
            }
        }
        else {
            return children[i];
        }
    }
};

/**
 * 获取本地存储数据
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-14T18:39:14+0800
 *
 * @param    {string}                 key 存储本地数据的key
 * @return   {any}
 */
window.Tools.getLocalData = function(key) {
    var data = cc.sys.localStorage.getItem(key); //从本地读取数据

    return data ? JSON.parse(data) : null;
};

/**
 * 存储数据到本地
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-14T18:40:22+0800
 *
 * @param    {string}                 key  
 * @param    {any}                 data 
 */
window.Tools.setLocalData = function(key, data) {
    cc.sys.localStorage.setItem(key, JSON.stringify(data));
};

window.Tools.setWebImage = function(sprite, url) {
    cc.loader.load(url, function(err, texture) {
        if(err){
            cc.log(err);
        }
        else {
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
    });
};

/**
 * 音频管理
 * @type {Object}
 */
window.Tools.audioEngine = {
    audioId: null,

    init: function(audioUrl, isLoop, volume) {
        this.audioRaw = audioUrl ? cc.url.raw(audioUrl) : null;
        this.isLoop = isLoop || false;
        this.volume = volume || 1;

        return clone(this);
    },

    play: function() {
        // if (this.audioId === null) {
            this.audioId = cc.audioEngine.play(this.audioRaw, this.isLoop, this.volume);
        // }
        // else if (this.state() !== 1) {
        //     cc.audioEngine.resume(this.audioId);
        // }
    },

    stop: function() {
        cc.audioEngine.pause(this.audioId);
    },

    state: function() {
        return cc.audioEngine.getState(this.audioId);
    },

    setAudioRaw: function(audioUrl) {
        this.audioRaw = cc.url.raw(audioUrl);
        return this;
    }
};

/**
 * 日期格式化
 * url: http://blog.csdn.net/vbangle/article/details/5643091/
 * author: meizz   
 *
 * 对Date的扩展，将 Date 转化为指定格式的String   
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
 * 例子：   
 * (new Date()).Format("yyyy-MM-dd hh:ii:ss.S") ==> 2006-07-02 08:09:04.423   
 * (new Date()).Format("yyyy-M-d h:i:s.S")      ==> 2006-7-2 8:9:4.18   
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-15T22:22:55+0800
 *
 * @param    {int|string|object}    datetime
 * @param    {string}               formatString
 * 
 * @return   {string}
 */
window.Tools.formatDatetime = function(formatString, datetime) {
    datetime = datetime || new Date();
    datetime = typeof datetime === 'object' ? datetime : new Date(datetime);

    var o = {   
        "M+" : datetime.getMonth()+1,                 //月份   
        "d+" : datetime.getDate(),                    //日   
        "h+" : datetime.getHours(),                   //小时   
        "i+" : datetime.getMinutes(),                 //分   
        "s+" : datetime.getSeconds(),                 //秒   
        "q+" : Math.floor((datetime.getMonth()+3)/3), //季度   
        "S"  : datetime.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(formatString)) {
        formatString = formatString.replace(RegExp.$1, (datetime.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(formatString)) {
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        }
    }
    return formatString;   
};

/**
 * 截屏
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-16T18:44:00+0800
 *
 * @param    {node}                 node     需要截取的节点
 * @param    {Function}               callback
 * @param    {string}                 fileName 保存的名称
 */
window.Tools.captureScreen = function(node, callback, fileName) {
    fileName = fileName || "temp.jpg";

    //注意，EditBox，VideoPlayer，Webview 等控件无法截图

    if(CC_JSB) {
        //如果待截图的场景中含有 mask，请开启下面注释的语句
        var renderTexture = cc.RenderTexture.create(node.width, node.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        // var renderTexture = cc.RenderTexture.create(node.width, node.height);

        //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
        node.parent._sgNode.addChild(renderTexture);
        //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
        renderTexture.setVisible(false);

        //实际截屏的代码
        renderTexture.begin();
        //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
        node._sgNode.visit();
        renderTexture.end();
        renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_JPEG, true, function () {
            //把 renderTexture 从场景中移除
            renderTexture.removeFromParent();
            cc.log("capture screen successfully!");

            callback(jsb.fileUtils.getWritablePath() + fileName);
        });
    }
};

/**
 * 获取本地prefab资源
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-22 15:25:58
 *
 * @param    {string}                 name     需要获取的名称
 * @param    {Function}               callback
 * @param    {string}                 fileName 保存的名称
 */
window.Tools.loadPrefab = function(name, callback) {
    cc.loader.loadRes("prefab/" + name, cc.Prefab, function (error, prefab) {
        if (error) {
            cc.error("window.Tools.loadPrefab: 获取失败~, error: " + error);
            return;
        }
        callback(prefab);
    });
};

/**
 * 创建一个绑定待绑定的handler
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-23 16:08:50
 *
 * @param    {node}                 node     这个 node 节点是你的事件处理代码组件所属的节点
 * @param    {string}               component 这个是代码文件名
 * @param    {string}               handler 响应事件函数名
 * @param    {string}               customEventData 自定义事件数据
 */
window.Tools.createEventHandler = function (node, component, handler, customEventData) {
    var eventHandler = new cc.Component.EventHandler();
    eventHandler.target = node;
    eventHandler.component = component;
    eventHandler.handler = handler;
    eventHandler.customEventData = customEventData;

    return eventHandler;
};

/**
 * 热更新
 *
 * @author Make.<makehuir@gmail.com>
 * @datetime 2017-02-24 18:47:49
 * 
 * @type {Object}
 */
window.Tools.HotUpdate = {

    manifestUrl: cc.RawAsset,

    _isUpdating: false,

    _hasUpdate: false,
    
    _canRetry: false,

    assetsManager: Object,

    _checkUpdateListener: Function,

    _hotUpdateListener: Function,

    /**
     * 初始化热更新类
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:49:03+0800
     *
     * @param    {string}                 manifestUrl [description]
     */
    init: function(manifestUrl) {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }

        if (!manifestUrl) {
            cc.log("初始化没有传递 manifest url");
            return;
        }
        
        this.manifestUrl = manifestUrl;

        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        cc.log('Storage path for remote asset : ' + storagePath);
        // cc.log('Local manifest URL : ' + this.manifestUrl);
        
        // 获取 manifest 地址
        this._assetsManager = new jsb.AssetsManager(this.manifestUrl, storagePath);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetsManager.retain();
        }

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._assetsManager.setVersionCompareHandle(function(versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        });
        
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._assetsManager.setVerifyCallback(function(path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            // var size = asset.size;
            if (compressed) {
                cc.log("Verification passed : " + relativePath);
                return true;
            } else {
                cc.log("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
                return true;
            }
        });
        cc.log("Hot update is ready, please check or directly update.");
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._assetsManager.setMaxConcurrentTask(2);
            cc.log("Max concurrent tasks count have been limited to 2");
        }
    },

    /**
     * 检查是否有更新更新
     * 回调函数
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:49:36+0800
     *
     * @param    {Function}               callback
     */
    checkUpdateCallback: function (callback) {
        var self = this;

        this._checkCallback = this._checkCallback || function(event) {
            cc.log('Code: ' + event.getEventCode());
            var hasUpdate = false;

            switch (event.getEventCode()) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    cc.log("No local manifest file found, hot update skipped. 没有本地 manifest 文件");
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    cc.log("Fail to download manifest file, hot update skipped. 没有远程 manifest 文件");
                    break;
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    cc.log("Fail to download manifest file, hot update skipped. 无法下载");
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    cc.log("Already up to date with the latest remote version. 已经是最新版本, 无需更新");
                    break;
                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    cc.log("New version found, please try to update. 找到新版本");
                    hasUpdate = true;
                    break;
                default:
                    return;
            }

            cc.eventManager.removeListener(self._checkUpdateListener);
            self._checkUpdateListener = null;

            callback(hasUpdate);
        };

        this._checkUpdate();
    },

    /**
     * 检查是否有更新更新
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:50:20+0800
     *
     */
    _checkUpdate: function() {
        if (!this._assetsManager.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
            return;
        }

        this._checkUpdateListener = new jsb.EventListenerAssetsManager(this._assetsManager, this._checkCallback.bind(this));
        cc.eventManager.addListener(this._checkUpdateListener, 1);
        this._assetsManager.checkUpdate();
    },

    /**
     * 更新回调函数
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:50:33+0800
     *
     * @param    {Function}               callback [description]
     */
    hotUpdateCallback: function (callback) {
        var self = this;

        this._updateCallback = this._updateCallback || function(event) {
            var needRestart = false;
            var failed = false;
            var isSuccess = false;
            var byteProgress = 0.0;
            var fileProgress = 0.0;

            switch (event.getEventCode()) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    cc.log("No local manifest file found, hot update skipped. 没有本地 manifest 文件");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    byteProgress = event.getPercent() / 100;
                    fileProgress = event.getPercentByFile() / 100;

                    var msg = event.getMessage();
                    if (msg) {
                        cc.log("Updated file: " + msg);
                        cc.log(event.getPercent().toFixed(2) + "% : " + msg);
                    }
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    cc.log("Fail to download manifest file, hot update skipped. 没有远程 manifest 文件");
                    break;
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    cc.log("Fail to download manifest file, hot update skipped. 无法下载");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    cc.log("Already up to date with the latest remote version. 已经是最新版本, 无需更新");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    cc.log('Update finished. ' + event.getMessage());
                    needRestart = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    cc.log("Update failed. " + event.getMessage());
                    self._isUpdating = false;
                    self._canRetry = true;
                    break;
                case jsb.EventAssetsManager.ERROR_isUpdating:
                    cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                    break;
                case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                    cc.log(event.getMessage());
                    break;
                default:
                    break;
            }

            callback(isSuccess, byteProgress, fileProgress);

            if (failed) {
                cc.eventManager.removeListener(self._hotUpdateListener);
                self._hotUpdateListener = null;
                self._isUpdating = false;
            }

            if (needRestart) {
                cc.eventManager.removeListener(self._hotUpdateListener);
                self._hotUpdateListener = null;

                // Prepend the manifest's search path
                var searchPaths = jsb.fileUtils.getSearchPaths();
                var newPaths = self._assetsManager.getLocalManifest().getSearchPaths();
                console.log(JSON.stringify(newPaths));
                Array.prototype.unshift(searchPaths, newPaths);

                // This value will be retrieved and appended to the default search path during game startup,
                // please refer to samples/js-tests/main.js for detailed usage.
                // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                cc.game.restart();
            }
        };

        this._hotUpdate();
    },
    
    /**
     * 立即更新
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:50:53+0800
     *
     */
    _hotUpdate: function() {
        if (this._assetsManager && !this._isUpdating) {
            this._isUpdating = true;
            this._hotUpdateListener = new jsb.EventListenerAssetsManager(this._assetsManager, this._updateCallback.bind(this));
            cc.eventManager.addListener(this._hotUpdateListener, 1);
            this._assetsManager.update();
        }
    },

    /**
     * 断点续传
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:51:03+0800
     *
     */
    retry: function() {
        if (!this._isUpdating && this._canRetry) {
            this._canRetry = false;
            cc.log("Retry failed Assets...");
            this._assetsManager.downloadFailedAssets();
        }
    },

    /**
     * 销毁当前绑定对象
     *
     * @author Make.<makehuir@gmail.com>
     * @datetime 2017-02-24T18:51:16+0800
     *
     */
    destroy: function() {
        if (this._hotUpdateListener) {
            cc.eventManager.removeListener(this._hotUpdateListener);
            this._hotUpdateListener = null;
        }
        if (this._assetsManager && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetsManager.release();
        }
    }

};
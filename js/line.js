/**
 * constructor {line} 折线图构造函数
 * param {ctx:Context} 绘图环境
 * param {data:Array}  绘制折线图的数据
 * param {padding:Object} 设置坐标轴到画布的边距
 * param {arrow:object} 设置箭头的宽高
*/
function Line(ctx, data, padding, arrow) {
    this.ctx = ctx;
    this.data = data;
    // 设置默认值
    this.padding = padding || {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    this.arrow = arrow || {
        width: 10,
        height: 20
    }

    // 上顶点的坐标
    this.vertexTop = {
        x: this.padding.left,
        y: this.padding.top
    };
    // 原点坐标
    this.origin = {
        x: this.padding.left,
        // y = 画布的高度  - 底部距离
        y: this.ctx.canvas.height - this.padding.bottom
    }
    // 右顶点的坐标
    this.vertexRight = {
        // x = 画布的宽度 - 右边的距离
        x: this.ctx.canvas.width - this.padding.right,
        // y = 画布的高度  - 底部距离
        y: this.ctx.canvas.height - this.padding.bottom
    }
    // 计算出坐标轴的最大刻度
    this.coordWidth = this.ctx.canvas.width - this.padding.left - this.padding.right - this.arrow.height;
    this.coordHeight = this.ctx.canvas.height - this.padding.top - this.padding.bottom - this.arrow.height;
}

// 替换原型对象
Line.prototype = {
    constructor: Line,
    draw: function () {
        // 绘制坐标
        this.drawCoord();
        // 绘制箭头
        this.drawArrow();
        // 根据数据绘制折线图
        this.drawLine();
    },
    // 绘制坐标轴
    drawCoord: function () {
        this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
        this.ctx.lineTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.vertexRight.x, this.vertexRight.y);
        this.ctx.stroke();
    },
    // 绘制箭头
    drawArrow: function () {
        // 1.上箭头
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
        this.ctx.lineTo(this.vertexTop.x - this.arrow.width / 2, this.vertexTop.y + this.arrow.height);
        this.ctx.lineTo(this.vertexTop.x, this.vertexTop.y + this.arrow.height / 2);
        this.ctx.lineTo(this.vertexTop.x + this.arrow.width / 2, this.vertexTop.y + this.arrow.height);
        // 闭合路径
        this.ctx.closePath();
        // 填充
        this.ctx.fill();

        // 2.右箭头
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertexRight.x, this.vertexRight.y);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height, this.vertexRight.y - this.arrow.width / 2);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height / 2, this.vertexRight.y);
        this.ctx.lineTo(this.vertexRight.x - this.arrow.height, this.vertexRight.y + this.arrow.width / 2);
        // 闭合路径
        this.ctx.closePath();
        // 填充
        this.ctx.fill();
    },
    // 根据数据绘制折线图
    drawLine: function () {
        var self = this;
        this.ctx.beginPath();
        /**
         * 计算x和y轴的缩放比例
         * ratioX = coordWidth / data.length
         * ratioY = coordHeight / Maht.max.apply(null,data)
        */
        var ratioX = this.coordWidth / this.data.length;
        var ratioY = this.coordHeight / Math.max.apply(null, this.data);

        // 遍历所有数据,绘制点
        this.data.forEach(function (y, x) {
            self.ctx.fillRect(self.origin.x + x * ratioX - 5, self.origin.y - y * ratioY - 5, 10, 10);
        });
        // 遍历所有数据,绘制直线
        this.data.forEach(function (y, x) {
            self.ctx.lineTo(self.origin.x + x * ratioX, self.origin.y - y * ratioY);
        })
        this.ctx.stroke();
    }
}
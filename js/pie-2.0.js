/*
* constrcutor { Pie } 饼图构造函数
* param { x: number } 圆心x轴坐标
* param { y: number } 圆心y轴坐标
* param { r: number } 圆半径
* param { data: Array } 绘制饼图所需的数据
* */
function Pie(ctx, x, y, r, data) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.r = r;
    this.data = data;

    // 一组颜色
    this.colors = ['orange', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'peru', 'pink'];
}
// 扩充原型对象
extend(Pie.prototype, {
    draw: function () {
        var self = this;
        var sum = 0;
        // 1.求出数据的总和
        this.data.forEach(function (item, index) {
            sum += item.value;
        })
        // 2.求出单位数值对应的角度
        // 用总共的角度 / 总共的值
        var angle = 360 / sum;
        // 3.初始开始角度值为0  结束角度值为0
        var startAngle = 0, endAngle = 0, lineX, lineY, lineAngle;
        this.data.forEach(function (item, index) {
            // 4.计算每个数据对应的开始角度值和结束角度
            startAngle = endAngle;
            endAngle = endAngle + item.value * angle;

            // 5.求出牵引线的角度
            lineAngle = startAngle + item.value * angle / 2;
            // 6.求出牵引线的坐标值
            // 为什么要加20,是为了让牵引线超出来
            lineX = self.x + (self.r + 40) * Math.cos(angleToRadian(lineAngle));
            lineY = self.y + (self.r + 40) * Math.sin(angleToRadian(lineAngle));

            // 7.开始绘制
            ctx.beginPath();
            ctx.moveTo(self.x, self.y);
            ctx.arc(self.x, self.y, self.r, angleToRadian(startAngle), angleToRadian(endAngle));
            ctx.closePath();
            ctx.fillStyle = self.colors[index];
            ctx.fill();

            // 8.绘制牵引线(也就是每一个扇形的平分线)
            ctx.beginPath();
            ctx.moveTo(self.x, self.y);
            ctx.lineTo(lineX, lineY);
            ctx.strokeStyle = self.colors[index];
            ctx.stroke();

            // 9.在牵引线旁边绘制文字
            ctx.font = '20px 微软雅黑';
            if (lineAngle >= 90 && lineAngle <= 270) {
                // 左半球 文字对齐为right
                ctx.textAlign = 'right';
            } else {
                // 右半球 文字对齐为left
                ctx.textAlign = 'left';
            }
            ctx.fillText(item.name, lineX, lineY);
        });
    }
});
// 混入式继承
function extend(o1, o2) {
    for (var key in o2) {
        // 只有o2自己的属性才会copy到o1身上
        if (o2.hasOwnProperty(key)) {
            o1[key] = o2[key];
        }
    }
}

// 把角度转换为弧度
function angleToRadian(angle) {
    return Math.PI / 180 * angle;
}
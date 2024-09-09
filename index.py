import turtle as m
import colorsys

m.bgcolor("black")
m.tracer(968)
def drow ():
    color = 0.001
    h = 0
    n = 20
    m.up()
    m.goto(0,0)
    m.down()
    m.pensize()
    for i in range(90):
        color += .05
        c = colorsys.hsv_to_rgb(color,1,1)
        h += 1/n
        m.color(c)
        m.fd(10)
        m.circle(i,4.5)
        for j in range(550):
            m.lt(971)
            m.circle(i * .1,j,steps=2)
            m.circle(i,2)
drow()
m.done()


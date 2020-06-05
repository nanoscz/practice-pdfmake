import { Component, OnInit } from '@angular/core';

/** Libraries PDF */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit(): void { }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async generatePdf() {
    const data = {
      title: 'Title of the PDF',
      date: 'Some date',
      logo: {
        img: '/assets/logo.png',
        title: 'Title',
        subTitle: 'Sub Title'
      },
      content: {
        text: 'Lorem: ipsum dolor sit amet'
      }
    }
    const docDefinition = {
      content: [
        {
          columns: [
            {
              alignment: 'left',
              columns: [
                {
                  image: await this.getBase64ImageFromURL(data.logo.img),
                  width: 60
                },
                {
                  style: 'logoTitle',
                  text: `${data.logo.title}
                         ${data.logo.subTitle}`
                }
              ]
            },
            {
              alignment: 'center',
              style: 'title',
              text: data.title,
            },
            {
              alignment: 'right',
              style: 'date',
              text: data.date,
            }
          ],
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              text: `${data.content.text}
                     ${data.content.text}
                     ${data.content.text}
                     ${data.content.text}

                     ${data.content.text}`
            },
            {
              text: `${data.content.text}

                     ${data.content.text}
                     ${data.content.text}
                     ${data.content.text}
                     ${data.content.text}`
            },
          ]
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              text: `___________________
                     ${data.content.text}`
            },
            {
              text: `___________________
                     ${data.content.text}`
            },
          ]
        }
      ],
      styles: {
        title: {
          margin: [0, 30, 0, 0],
          bold: true,
          fontSize: 16
        },
        logoTitle: {
          fontSize: 12,
          margin: [0, 16, 0, 0],
        },
        date: {
          italics: true
        }
      }
    }
    pdfMake.createPdf(docDefinition).open();
  }

}

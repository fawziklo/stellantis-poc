import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Gallery, GalleryItem, GalleryRef, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']

})

export class GalleryComponent implements OnInit, OnDestroy {

  constructor(private gallery: Gallery) { }


  @Input() imagesMetaData: string[] | any;
  galleryId = 'mixedExample';
  images: GalleryItem[] = [];
  noImage = "../../assets/image-not-found-scaled.png"
  galleryRef: GalleryRef | any;

  ngOnInit(): void {

    this.galleryRef = this.gallery.ref(this.galleryId);


    if (this.imagesMetaData.length > 0) {
      Array.from(this.imagesMetaData).forEach((val: any) => { this.images.push(new ImageItem({ src: val, thumb: val })) })
    }
    else {
      this.images.push(new ImageItem({ src: this.noImage, thumb: this.noImage }))
    }

  }

  ngOnDestroy(): void {
    this.galleryRef.destroy(this.galleryId)
    this.images = []
  }


}


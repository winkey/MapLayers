# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='config',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lid', models.BigIntegerField(unique=True)),
                ('name', models.TextField(unique=True)),
                ('type', models.TextField(choices=[(b'ArcXML', b'ArcXML'), (b'GDAL', b'GDAL'), (b'Image', b'Image'), (b'Mapserver', b'Mapserver'), (b'Mapnik', b'Mapnik'), (b'WMS', b'WMS')])),
                ('mapfile', models.TextField()),
                ('file', models.TextField()),
                ('url', models.TextField()),
                ('username', models.TextField()),
                ('password', models.TextField()),
                ('off_layers', models.TextField()),
                ('projection', models.TextField()),
                ('layers', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), size=None)),
                ('bbox', django.contrib.postgres.fields.ArrayField(default=[-180, -90, 180, 90], base_field=models.FloatField(), size=4)),
                ('data_extent', django.contrib.postgres.fields.ArrayField(null=True, base_field=models.FloatField(), size=4)),
                ('size', django.contrib.postgres.fields.ArrayField(default=[256, 256], base_field=models.IntegerField(), size=2)),
                ('resolutions', django.contrib.postgres.fields.ArrayField(null=True, base_field=models.FloatField(), size=None)),
                ('levels', models.FloatField(default=20)),
                ('extension', models.TextField(default=b'png')),
                ('srs', models.TextField(default=b'EPSG:4326')),
                ('debug', models.NullBooleanField(default=False)),
                ('description', models.TextField()),
                ('watermarkimage', models.TextField()),
                ('watermarkopacity', models.FloatField(null=True)),
                ('extent_type', models.TextField()),
                ('tms_type', models.TextField()),
                ('units', models.TextField()),
                ('mime_type', models.TextField()),
                ('paletted', models.NullBooleanField()),
                ('spherical_mercator', models.NullBooleanField()),
                ('metadata', models.TextField()),
                ('expired', models.DateTimeField(null=True)),
                ('metatile', models.NullBooleanField(default=False)),
                ('metasize', django.contrib.postgres.fields.ArrayField(default=[5, 5], base_field=models.IntegerField(), size=2)),
                ('metabuffer', django.contrib.postgres.fields.ArrayField(default=[10, 10], base_field=models.IntegerField(), size=2)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
